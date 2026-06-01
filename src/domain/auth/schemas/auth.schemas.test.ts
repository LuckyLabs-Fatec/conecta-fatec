import { describe, expect, it } from 'vitest';
import { loginSchema } from './login.schema';
import { registerSchema } from './register.schema';

describe('loginSchema', () => {
  it('accepts valid credentials', () => {
    expect(loginSchema.parse({ email: 'user@fatec.test', password: 'secret' })).toEqual({
      email: 'user@fatec.test',
      password: 'secret',
    });
  });

  it.each([
    [{ email: '', password: 'secret' }, 'Email é obrigatório'],
    [{ email: 'invalid', password: 'secret' }, 'Email inválido'],
    [{ email: 'user@fatec.test', password: '' }, 'Senha é obrigatória'],
  ])('rejects invalid credentials', (credentials, message) => {
    expect(() => loginSchema.parse(credentials)).toThrow(message);
  });
});

describe('registerSchema', () => {
  const validRegistration = {
    name: 'User',
    email: 'user@fatec.test',
    phone: '15999999999',
    password: 'password',
    confirmPassword: 'password',
    agreeToTerms: true,
  };

  it('accepts a valid registration', () => {
    expect(registerSchema.parse(validRegistration)).toEqual(validRegistration);
  });

  it.each([
    [{ name: '' }, 'Nome completo é obrigatório'],
    [{ email: '' }, 'Email é obrigatório'],
    [{ email: 'invalid' }, 'Email inválido'],
    [{ password: 'short', confirmPassword: 'short' }, 'Senha deve ter pelo menos 8 caracteres'],
    [{ confirmPassword: '' }, 'Confirmação de senha é obrigatória'],
    [{ agreeToTerms: false }, 'Você deve aceitar os termos e condições'],
    [{ confirmPassword: 'different' }, 'Senhas não coincidem'],
  ])('rejects an invalid registration', (override, message) => {
    expect(() => registerSchema.parse({ ...validRegistration, ...override })).toThrow(message);
  });
});
