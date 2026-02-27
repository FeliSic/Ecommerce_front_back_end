import { useState } from 'react';
import { sendAuthEmail, getToken } from '../../lib/apiFetcher';
import { LogInContainer, LogInForm, FormInput, FormButton, SubtitleIngresar } from "@/ui/form";
import { Tiny } from '@/ui/typography';

export default function LogIn() {
  const [email, setEmail] = useState('');
  const [showTokenForm, setShowTokenForm] = useState(false);
  const [code, setCode] = useState('');

  const handleEmailSubmit = async (e: any) => {
    e.preventDefault();
    const result = await sendAuthEmail(email);
    console.log(result);
    if (result.success) {
      setShowTokenForm(true);
    } else {
      alert('Error sending auth email: ' + result.error);
    }
  };

  const handleTokenSubmit = async (e: any) => {
    e.preventDefault();
    const result = await getToken(email, code);
    if (result.success) {
      localStorage.setItem('apiToken', result.token || '');
      window.location.href = '/';
    } else {
      alert('Error getting token: ' + result.error);
    }
  };

  return (
    <LogInContainer>
      <LogInForm onSubmit={!showTokenForm ? handleEmailSubmit : handleTokenSubmit}>
        <SubtitleIngresar>Ingresar</SubtitleIngresar>
        {!showTokenForm ? (
          <>
            <FormInput 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
            <FormButton type="submit">Login</FormButton>
          </>
        ) : (<>
          <SubtitleIngresar>Código de Verificación</SubtitleIngresar>
          <FormInput 
              type="text" 
              id="code" 
              name="code" 
              value={code} 
              onChange={(e) => setCode(e.target.value)} 
              placeholder="Código de Verificación" 
            />
    <Tiny>Ingresa el código de verificación que se envió a tu correo electrónico</Tiny>
    <FormButton type="submit">Ingresar</FormButton>
  </>
        )}
      </LogInForm>
    </LogInContainer>
  );
}
