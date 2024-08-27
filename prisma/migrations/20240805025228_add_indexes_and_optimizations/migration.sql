-- CreateIndex
CREATE INDEX "PaymentDetails_month_year_idx" ON "PaymentDetails"("month", "year");

-- CreateIndex
CREATE INDEX "PersonalInfo_firstName_idx" ON "PersonalInfo"("firstName");

-- CreateIndex
CREATE INDEX "PersonalInfo_lastName_idx" ON "PersonalInfo"("lastName");

-- CreateIndex
CREATE INDEX "PersonalInfo_phone_idx" ON "PersonalInfo"("phone");
