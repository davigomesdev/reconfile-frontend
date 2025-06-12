export const validateCep = (value: string): boolean => {
  const cepRegex = /^\d{5}-\d{3}$/;
  return cepRegex.test(value);
};

export const validateCPF = (value: string): boolean => {
  const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/;
  return cpfRegex.test(value);
};

export const validateCNPJ = (value: string): boolean => {
  const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{14}$/;
  return cnpjRegex.test(value);
};

export const validatePhone = (value: string): boolean => {
  const cleanedText = value.replace(/\D/g, '');
  return cleanedText.length === 13;
};

export const validateDate = (value: string): boolean => {
  const dateRegex = /^([0-2]\d|3[01])\/(0\d|1[0-2])\/\d{4}$/;
  if (!dateRegex.test(value)) {
    return false;
  }

  const [day, month, year] = value.split('/').map(Number);

  const date = new Date(year, month - 1, day);
  return date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year;
};
