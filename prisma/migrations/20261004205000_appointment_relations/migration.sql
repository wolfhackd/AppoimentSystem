-- Add nullable relationships so existing appointments remain valid.
ALTER TABLE "Appointment"
ADD COLUMN "establishmentId" TEXT,
ADD COLUMN "serviceId" TEXT,
ADD COLUMN "clientId" TEXT;

CREATE INDEX "Appointment_establishmentId_data_idx"
ON "Appointment"("establishmentId", "data");

ALTER TABLE "Appointment"
ADD CONSTRAINT "Appointment_establishmentId_fkey"
FOREIGN KEY ("establishmentId") REFERENCES "Establishment"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Appointment"
ADD CONSTRAINT "Appointment_serviceId_fkey"
FOREIGN KEY ("serviceId") REFERENCES "Service"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Appointment"
ADD CONSTRAINT "Appointment_clientId_fkey"
FOREIGN KEY ("clientId") REFERENCES "Client"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
