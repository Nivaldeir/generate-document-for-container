import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const clientSchema = z.object({
  name: z.string().min(1),
  cnpj: z.string().min(1),
  address: z.string().min(1),
  logoUrl: z.string().optional(),
  signatureUrl: z.string().optional(),
  beneficiaryBank: z.string().optional(),
  bankCode: z.string().optional(),
  branchCode: z.string().optional(),
  swiftCode: z.string().optional(),
  swiftBic: z.string().optional(),
  intermediaryBank: z.string().optional(),
  accountNumber: z.string().optional(),
  routingNumber: z.string().optional(),
  beneficiaryAddress: z.string().optional(),
});

export type ClientFormValues = z.infer<typeof clientSchema>;

export const clientFormDefaultValues: ClientFormValues = {
  name: "",
  cnpj: "",
  address: "",
  logoUrl: "",
  signatureUrl: "",
  beneficiaryBank: "",
  bankCode: "",
  branchCode: "",
  swiftCode: "",
  swiftBic: "",
  intermediaryBank: "",
  accountNumber: "",
  routingNumber: "",
  beneficiaryAddress: "",
};

export const useClients = () => {
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingSignature, setUploadingSignature] = useState(false);
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: clientFormDefaultValues,
  });

  const logoPreview = form.watch("logoUrl");
  const signaturePreview = form.watch("signatureUrl");

  const handleAssetChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "signature"
  ) => {
    const file = event.target.files?.[0];
    if (!file?.type.startsWith("image/")) return;
    if (type === "logo") setUploadingLogo(true);
    else setUploadingSignature(true);
    try {
      const formData = new FormData();
      formData.append("type", type);
      formData.append("file", file);
      const res = await fetch("/api/upload-asset", { method: "POST", body: formData });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Falha no upload");
      }
      const { url } = await res.json();
      if (url) form.setValue(type === "logo" ? "logoUrl" : "signatureUrl", url);
    } catch (e) {
      console.error(e);
      alert(e instanceof Error ? e.message : "Erro ao enviar arquivo");
    } finally {
      if (type === "logo") setUploadingLogo(false);
      else setUploadingSignature(false);
    }
  };

  return {
    form,
    logoPreview,
    signaturePreview,
    uploadingLogo,
    uploadingSignature,
    handleLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => handleAssetChange(e, "logo"),
    handleSignatureChange: (e: React.ChangeEvent<HTMLInputElement>) => handleAssetChange(e, "signature"),
  };
};
