function startPaystackPayment() {
  const key = document.querySelector("[data-paystack-key]")?.getAttribute("data-paystack-key") || "";
  if (!key || key.includes("YOUR_PAYSTACK_PUBLIC_KEY_HERE")) {
    alert("Paystack key not set. Add your public key in donate.html (data-paystack-key).");
    return;
  }

  const amountNaira = Number(document.querySelector("#donateAmount")?.value || 0);
  const email = String(document.querySelector("#donorEmail")?.value || "").trim();

  if (!email) {
    alert("Please enter your email for receipt.");
    return;
  }
  if (!amountNaira || amountNaira < 100) {
    alert("Please enter a valid amount (min ₦100).");
    return;
  }

  // Paystack expects amount in kobo
  const amountKobo = Math.round(amountNaira * 100);

  // eslint-disable-next-line no-undef
  const handler = PaystackPop.setup({
    key,
    email,
    amount: amountKobo,
    currency: "NGN",
    ref: "JAF_" + Math.floor(Math.random() * 1000000000) + "_" + Date.now(),
    callback: function (response) {
      alert("Payment successful! Reference: " + response.reference + "\nPlease screenshot this as proof.");
      const refEl = document.querySelector("[data-paystack-ref]");
      if (refEl) refEl.textContent = response.reference;
    },
    onClose: function () {
      // Quiet close
    }
  });

  handler.openIframe();
}

(function () {
  const btn = document.querySelector("[data-paystack-btn]");
  if (btn) btn.addEventListener("click", startPaystackPayment);
})();
