export const cpfMask = value => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2') 
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1') 
  }

  export const phoneMask = value => {
    return value
      .replace(/\D/g, '(')
      .replace(/(\d{2})(\d)/, '$1) $2') 
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(\d{5})\d+?$/, '$1') 
  }