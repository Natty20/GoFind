const validateForm = (formData) => {
  const errors = {};

  // Nom / Prénom
  if (!formData.nom?.trim()) errors.nom = 'Le nom est requis';
  if (!formData.prenom?.trim()) errors.prenom = 'Le prénom est requis';

  // Email
  if (!formData.email?.trim()) errors.email = "L'email est requis";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
    errors.email = 'Email invalide';

  // Password
  if (!formData.password) errors.password = 'Le mot de passe est requis';
  else if (formData.password.length < 8)
    errors.password =
      'Le mot de passe doit avooir au moins 6 caractères, une majuscule, minuscule et un caractère spécial.';

  // Confirm password
  if (formData.password !== formData.confirmPassword)
    errors.confirmPassword = 'Les mots de passe ne correspondent pas';

  // Phone
  if (!formData.phone) errors.phone = 'Le numéro de téléphone est requis';
  else if (!/^(06|07)[0-9]{8}$/.test(formData.phone))
    errors.phone =
      'Veuillez entrer un numéro de téléphone mobile valide (06 ou 07, 10 chiffres).';

  // Adresse
  if (!formData.address?.trim()) errors.address = 'La ville est obligatoire';

  return errors;
};
