import { defineRule, configure } from "vee-validate";
import { required, email, confirmed, min } from "@vee-validate/rules";


defineRule("required", required);
defineRule("email", email);
defineRule("confirmed", confirmed);
defineRule("min", min);

configure({
  generateMessage: ({ field, rule }) => {
    const name = {
      name: "Nome completo",
      email: "Email institucional",
      password: "Senha",
      confirmPassword: "Confirmar senha",
    }[field] ?? field;

    const messages = {
      required: `O campo ${name} é obrigatório.`,
      email: `O campo ${name} deve ser um email válido.`,
      min: `O campo ${name} deve ter no mínimo ${rule.params[0]} caracteres.`,
      confirmed: `A confirmação da senha não confere.`,
    };

    return messages[rule.name] || `O campo ${name} é inválido.`;
  },
  validateOnInput: true,
});
