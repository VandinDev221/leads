/**
  Formata e gera um link válido de WhatsApp wa.me garantindo o código de país 55.
 */
export function formatWhatsappUrl(phoneOrWhatsapp?: string | null): string | null {
  if (!phoneOrWhatsapp) return null;
  const digits = phoneOrWhatsapp.replace(/\D/g, '');
  if (!digits || digits.length < 8) return null;

  let fullNumber = digits;

  // Se tem 10 dígitos (DDD + fone 8 dígitos) ou 11 dígitos (DDD + fone 9 dígitos)
  if (digits.length === 10 || digits.length === 11) {
    fullNumber = `55${digits}`;
  } else if (digits.length === 12 || digits.length === 13) {
    if (!digits.startsWith('55')) {
      fullNumber = `55${digits}`;
    }
  }

  return `https://wa.me/${fullNumber}`;
}

/**
 * Normaliza e format a exibição de telefones no padrão brasileiro (XX) XXXXX-XXXX
 */
export function formatPhoneDisplay(phone?: string | null): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, '');
  if (!digits) return null;

  // Remove 55 do início se presente para formatar exibição local
  let localDigits = digits;
  if ((digits.length === 12 || digits.length === 13) && digits.startsWith('55')) {
    localDigits = digits.slice(2);
  }

  if (localDigits.length === 11) {
    return `(${localDigits.slice(0, 2)}) ${localDigits.slice(2, 7)}-${localDigits.slice(7)}`;
  } else if (localDigits.length === 10) {
    return `(${localDigits.slice(0, 2)}) ${localDigits.slice(2, 6)}-${localDigits.slice(6)}`;
  }

  return phone;
}
