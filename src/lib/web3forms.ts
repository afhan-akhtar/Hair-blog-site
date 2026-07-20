export async function submitWeb3Form(
  formData: FormData
): Promise<{ success: boolean; message?: string }> {
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

  if (!accessKey) {
    return {
      success: false,
      message: "Form is not configured. Please add NEXT_PUBLIC_WEB3FORMS_KEY to .env",
    };
  }

  formData.append("access_key", accessKey);

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();

    return {
      success: Boolean(data.success),
      message: data.message || (data.success ? undefined : "Something went wrong. Please try again."),
    };
  } catch {
    return { success: false, message: "Network error. Please check your connection and try again." };
  }
}
