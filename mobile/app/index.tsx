import { Redirect } from 'expo-router';

export default function Index() {
  // Para fins de demonstração, redirecionamos sempre para o login na primeira abertura.
  // Em uma aplicação real, aqui verificaríamos se o usuário já possui um token de acesso.
  return <Redirect href="/auth/login" />;
}