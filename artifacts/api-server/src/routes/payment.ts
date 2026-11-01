import { Router, type IRouter } from "express";
import crypto from "crypto";
import { db } from "@workspace/db";
import { ordersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreatePaymentBody, CheckPaymentStatusParams } from "@workspace/api-zod";

const router: IRouter = Router();

const ABA_MERCHANT_ID = process.env.ABA_MERCHANT_ID || "ec474370";
const ABA_API_KEY = process.env.ABA_API_KEY || "058811df8b78a4fa211acc1425258395df75841e";
const ABA_RSA_PRIVATE_KEY = process.env.ABA_RSA_PRIVATE_KEY || `-----BEGIN RSA PRIVATE KEY-----
MIICWwIBAAKBgQCN2ms8BJgKWsFCe7Ft7iA4B00Lcg1Uz9Sde6A9QbWEssl2ZJQ9
dsJOrfdOBmj2VWAlGpnDPDGw1ulw/vn7Le1HX9mWEMNBdz+Q3jbypaTC6PZOcjMU
VQwpZo64ldpB9zJxXkMZgvw5ikOXUeikuw6KFQEE/kuLFGtqR7BOwHjE1QIDAQAB
AoGAI+n/SVg+aCy3Dk6DyvnFhXnvuyyajHT79w00Mh4fR2P+lq97Sp51LndkDAia
bXeLGonEEUZ9rDCVNMsRXlMv5gfJ2teLbr223A/qqSLbHaPsbIB2IR2rR6MEJLZU
oz4KQgQfF6e58xyrj2csjh8kNrXqAtZihVsigtxUemYNHDcCQQCtviYjAVgfui4x
jbs78rdy726z/ZyaLuoNM3mYuqcNfIbkh5uDmGNMS07HmpsFFumjQXessxTGq1rb
7pEHjMebAkEA0QM2U9BVN39PXHmOeARhPmfSNMSyzTnYdV7cTLzWYz389ASseq+9
m74Zy6dPsTHVaLAuY0drXMWnN91wkiZETwJAVgOGI9xdgU+N4PB22kXeNiN9HdSX
e+lv69so/sihPVcB/Q95mRuPRU0fEkhjKJDgV/doRPJffb+Fes5PtHooswJAUT+y
arpdpgkzTHtkSntJYfzx1dlwuB54aofJk3sEy+dY4XK/qaGPT2+Cj4wmincYwm1a
WvV0YsfizPCjxexiOQJAI6uiVPRgfrLNln4h7C3NOe6kUfGgMsO5Dg44KtP5Gax+
H8Z0FrwuU4m82q57qwPwutWCxbPjq8fgbPhN5yncFw==
-----END RSA PRIVATE KEY-----`;

const ABA_API_URL = "https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase";

function generateABAHash(data: string): string {
  const sign = crypto.createSign("SHA256");
  sign.update(data);
  sign.end();
  return sign.sign(ABA_PRIVATE_KEY_FORMATTED, "base64");
}

const ABA_PRIVATE_KEY_FORMATTED = ABA_RSA_PRIVATE_KEY;

function getCurrentDatetime(): string {
  const now = new Date();
  return now.toISOString().replace(/[-:T]/g, "").slice(0, 14);
}

router.post("/payment/create", async (req, res) => {
  const parseResult = CreatePaymentBody.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: "INVALID_REQUEST", message: "Invalid payment data" });
    return;
  }

  const { amount, currency, orderId, description, firstName, lastName, email, phone } = parseResult.data;

  const transactionId = `NOKORMC_${orderId}_${Date.now()}`;
  const datetime = getCurrentDatetime();
  const returnUrl = `${process.env.REPLIT_DEV_DOMAIN || "https://nokormc.replit.app"}/payment/success`;
  const continueSuccessUrl = returnUrl;

  const reqData = [
    datetime,
    ABA_MERCHANT_ID,
    transactionId,
    amount.toFixed(2),
    currency || "USD",
    description || "Top Up",
    firstName || "",
    lastName || "",
    email || "",
    phone || "",
    returnUrl,
    continueSuccessUrl,
  ].join("");

  let hash: string;
  try {
    hash = generateABAHash(reqData);
  } catch (err) {
    req.log.error({ err }, "Failed to generate ABA hash");
    res.status(500).json({ error: "HASH_ERROR", message: "Payment signature generation failed" });
    return;
  }

  const payload = {
    req_time: datetime,
    merchant_id: ABA_MERCHANT_ID,
    tran_id: transactionId,
    amount: amount.toFixed(2),
    currency: currency || "USD",
    payment_option: "abapay",
    item_name: description || "Top Up",
    firstname: firstName || "",
    lastname: lastName || "",
    email: email || "",
    phone: phone || "",
    return_url: returnUrl,
    continue_success_url: continueSuccessUrl,
    hash,
  };

  try {
    const response = await fetch(ABA_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    let abaData: Record<string, unknown>;
    try {
      abaData = JSON.parse(responseText);
    } catch {
      req.log.error({ responseText }, "ABA API returned non-JSON");
      res.status(500).json({ error: "ABA_ERROR", message: "Payment gateway error" });
      return;
    }

    if (!response.ok) {
      req.log.error({ abaData }, "ABA API error response");
      res.status(500).json({ error: "PAYMENT_FAILED", message: "Payment creation failed" });
      return;
    }

    const qrCode = (abaData.qr_image as string) || (abaData.abapay_deeplink as string) || "";
    const deeplink = (abaData.abapay_deeplink as string) || "";

    res.json({
      transactionId,
      qrCode,
      deeplink,
      amount,
      currency: currency || "USD",
      status: "pending",
    });
  } catch (err) {
    req.log.error({ err }, "Failed to call ABA API");
    res.status(500).json({ error: "NETWORK_ERROR", message: "Failed to connect to payment gateway" });
  }
});

router.get("/payment/check/:transactionId", async (req, res) => {
  const parseResult = CheckPaymentStatusParams.safeParse(req.params);
  if (!parseResult.success) {
    res.status(400).json({ error: "INVALID_REQUEST", message: "Invalid transaction ID" });
    return;
  }

  const { transactionId } = parseResult.data;
  const datetime = getCurrentDatetime();

  const reqData = [datetime, ABA_MERCHANT_ID, transactionId].join("");
  let hash: string;
  try {
    hash = generateABAHash(reqData);
  } catch (err) {
    req.log.error({ err }, "Failed to generate ABA hash for check");
    res.status(500).json({ error: "HASH_ERROR", message: "Signature generation failed" });
    return;
  }

  const checkUrl = "https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/check-transaction-2";

  try {
    const response = await fetch(checkUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        req_time: datetime,
        merchant_id: ABA_MERCHANT_ID,
        tran_id: transactionId,
        hash,
      }),
    });

    const responseText = await response.text();
    let abaData: Record<string, unknown>;
    try {
      abaData = JSON.parse(responseText);
    } catch {
      res.json({
        transactionId,
        status: "pending",
        amount: 0,
        currency: "USD",
      });
      return;
    }

    const statusMap: Record<string, string> = {
      "0": "success",
      "1": "pending",
      "2": "failed",
      "3": "expired",
    };

    const abaStatus = String(abaData.status || abaData.tran_status || "1");
    const status = statusMap[abaStatus] || "pending";

    if (status === "success") {
      await db
        .update(ordersTable)
        .set({ status: "completed" })
        .where(eq(ordersTable.transactionId, transactionId));
    }

    res.json({
      transactionId,
      status,
      amount: Number(abaData.amount || 0),
      currency: String(abaData.currency || "USD"),
      paidAt: status === "success" ? new Date().toISOString() : undefined,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to check ABA payment status");
    res.json({
      transactionId,
      status: "pending",
      amount: 0,
      currency: "USD",
    });
  }
});

export default router;
