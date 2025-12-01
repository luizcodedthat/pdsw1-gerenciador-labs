<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { Form, Field, ErrorMessage } from "vee-validate";
import { useAuthStore } from "@/stores/useAuthStore";
import { createUser, loginWithGoogle } from "@/firebase/firebase";
import { updateProfile } from "firebase/auth";
import { LucideEye, LucideEyeClosed } from "lucide-vue-next";

const router = useRouter();
const authStore = useAuthStore();

// CAMPOS
const name = ref("");
const email = ref("");
const password = ref("");

// ERROS ABAIXO DOS INPUTS
const emailError = ref("");
const googleError = ref("");

// MOSTRAR/OCULTAR SENHA
const showPassword = ref(false);

// VALIDAR EMAIL INSTITUCIONAL EM TEMPO REAL
function validateInstitutionalEmail() {
  if (!email.value) {
    emailError.value = "";
    return;
  }

  if (
    !email.value.endsWith("@discente.ifpe.edu.br") &&
    !email.value.endsWith("@palmares.ifpe.edu.br")
  ) {
    emailError.value =
      "Use um email institucional (@discente.ifpe.edu.br ou @palmares.ifpe.edu.br)";
  } else {
    emailError.value = "";
  }
}

// REGRAS DA SENHA
const hasUppercase = computed(() => /[A-Z]/.test(password.value || ""));
const hasNumber = computed(() => /[0-9]/.test(password.value || ""));
const hasSpecial = computed(() => /[!@#$%^&*(),.?":{}|<>]/.test(password.value || ""));
const hasMinLength = computed(() => (password.value?.length || 0) >= 8);
const canRegister = computed(() => passwordStrength.value === 4);

// Força da senha
const passwordStrength = computed(() => {
  let score = 0;
  if (hasUppercase.value) score++;
  if (hasNumber.value) score++;
  if (hasSpecial.value) score++;
  if (hasMinLength.value) score++;
  return score; // 0 a 4
});

// CADASTRO
async function handleRegister() {
  validateInstitutionalEmail();
  if (emailError.value) return;

  try {
    const userCredential = await createUser(email.value, password.value);
    const user = userCredential.user;

    await updateProfile(user, { displayName: name.value });
    authStore.user = user;

    router.push({ name: "Laboratorios" });
  } catch (error) {
    emailError.value = "Erro ao criar conta: " + error.message;
  }
}

// LOGIN COM GOOGLE
async function handleRegisterGoogle() {
  googleError.value = "";

  try {
    const result = await loginWithGoogle();
    const userEmail = result.user.email;

    if (
      !userEmail.endsWith("@discente.ifpe.edu.br") &&
      !userEmail.endsWith("@palmares.ifpe.edu.br")
    ) {
      googleError.value = "Somente emails institucionais podem acessar.";
      return;
    }

    authStore.user = result.user;
    router.push({ name: "Laboratorios" });
  } catch (err) {
    googleError.value = "Erro ao entrar com Google: " + err.code;
  }
}
</script>

<template>
  <!-- BOTÃO LOGIN -->
  <button class="login-top-button" @click="router.push('/login')">Login</button>
  <div class="login-container">
    <!-- ESQUERDA -->
    <div class="login-left">
      <h1 class="logo">ReservaLab</h1>
      <p class="quote">
        "A única maneira de fazer um ótimo trabalho é amar o que você faz."<br />
        <span class="span">– Steve Jobs</span>
      </p>
    </div>

    <!-- DIREITA -->
    <div class="login-right">
      <div class="login-box">
        <h2>Crie sua conta</h2>
        <p class="subtitle">Insira seus dados para se cadastrar</p>

        <Form @submit="handleRegister" class="form">
          <!-- NOME -->
          <div class="input-wrapper">
            <Field name="name" rules="required" v-slot="{ field, meta }">
              <input
                v-bind="field"
                type="text"
                placeholder="Nome completo"
                class="input-text"
                :class="{ 'input-error': meta.touched && !meta.valid }"
              />
            </Field>
            <ErrorMessage name="name" class="error" />
          </div>

          <!-- EMAIL -->
          <div class="input-wrapper">
            <Field name="email" rules="required|email" v-slot="{ field, meta }">
              <input
                v-bind="field"
                v-model="email"
                type="email"
                placeholder="Email institucional"
                class="input-text"
                @input="validateInstitutionalEmail()"
                :class="{ 'input-error': (meta.touched && !meta.valid) || emailError }"
              />
            </Field>
            <ErrorMessage name="email" class="error" />
            <p v-if="emailError" class="error">{{ emailError }}</p>
          </div>

          <!-- SENHA -->
          <div class="input-wrapper">
            <Field name="password" rules="required|min:8" v-slot="{ field, meta }">
              <div style="position: relative">
                <input
                  v-bind="field"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Senha (mín. 8 caracteres)"
                  class="input-text"
                  :class="{ 'input-error': meta.touched && !meta.valid }"
                />

                <span @click="showPassword = !showPassword" class="eye-icon">
                  <LucideEye v-if="showPassword" />
                  <LucideEyeClosed v-else />
                </span>
              </div>
            </Field>
            <ErrorMessage name="password" class="error" />

            <!-- CHECKLIST -->
            <ul class="password-check">
              <li :style="{ color: hasMinLength ? 'green' : 'red' }">✔ Mínimo 8 caracteres</li>
              <li :style="{ color: hasUppercase ? 'green' : 'red' }">
                ✔ Pelo menos 1 letra maiúscula
              </li>
              <li :style="{ color: hasNumber ? 'green' : 'red' }">✔ Pelo menos 1 número</li>
              <li :style="{ color: hasSpecial ? 'green' : 'red' }">
                ✔ Pelo menos 1 caractere especial
              </li>
            </ul>

            <!-- FORÇA DA SENHA -->
            <div class="strength-bar">
              <div
                :style="{
                  height: '100%',
                  width: passwordStrength * 25 + '%',
                  background:
                    passwordStrength <= 1
                      ? 'red'
                      : passwordStrength === 2
                      ? 'orange'
                      : passwordStrength === 3
                      ? 'gold'
                      : 'green',
                  borderRadius: '4px',
                }"
              ></div>
            </div>
          </div>

          <button
            type="submit"
            class="btn-primary btn-green"
            :disabled="!canRegister"
            :class="{ 'btn-disabled': !canRegister }"
          >
            Cadastrar
          </button>
        </Form>

        <div class="divider">ou cadastre-se com</div>

        <!-- GOOGLE -->
        <button class="btn-secondary" @click="handleRegisterGoogle">
          <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" class="icon" />
          Entrar com Google
        </button>

        <p v-if="googleError" class="error" style="margin-top: 8px">
          {{ googleError }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Layout geral */
.login-container {
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif;
}

/* Coluna esquerda */
.login-left {
  flex: 1;
  background: #18181b;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2rem;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-gray-background);
}

.quote {
  font-size: 0.9rem;
  line-height: 1.4;
  opacity: 0.9;
  color: var(--color-gray-background);
}

.span {
  font-style: italic;
  font-weight: 500;
  color: var(--color-gray-background);
}

/* Coluna direita */
.login-right {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-box {
  width: 100%;
  max-width: 380px;
  text-align: center;
}

.input-wrapper {
  margin-bottom: 1rem;
  text-align: left;
}

.input-text {
  width: 100%;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  transition: 0.2s;
}

.input-error {
  border-color: red !important;
}

.error {
  color: red;
  font-size: 0.8rem;
}

.eye-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

.password-check {
  font-size: 0.8rem;
  margin-top: 6px;
  padding-left: 20px;
}

.strength-bar {
  height: 6px;
  width: 100%;
  background: #ddd;
  margin-top: 6px;
  border-radius: 4px;
}

.btn-primary {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 6px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 1rem;
}

.btn-green {
  background-color: var(--color-primary);
}

.btn-green:hover {
  background-color: #16a34a;
}

.btn-secondary {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  background: white;
  display: flex;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
}

.divider {
  margin: 1rem 0;
  font-size: 0.8rem;
  color: #9ca3af;
  text-transform: uppercase;
}

.icon {
  width: 20px;
  height: 20px;
}

/* Botão Login no canto superior direito */
.login-top-button {
  position: absolute;
  top: 20px;
  right: 20px;

  background: var(--color-primary);
  color: white;

  padding: 10px 20px;
  border-radius: 6px;
  border: none;

  font-weight: bold;
  font-size: 0.9rem;

  cursor: pointer;
  transition: 0.2s ease;

  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.login-top-button:hover {
  background: #16a34a;
}

.btn-disabled {
  background: #ccc !important;
  cursor: not-allowed !important;
  color: #666 !important;
}
</style>
