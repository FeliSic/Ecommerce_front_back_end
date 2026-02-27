import { FormButton, FormInput, LogInContainer, LogInForm, SubtitleIngresar } from "@/ui/form";


export default function Profile(){
    return(
        <LogInContainer>
            <LogInForm>
                <SubtitleIngresar>Perfil</SubtitleIngresar>
                <FormInput type="name" placeholder="Nombre Completo" />
                <FormInput type="email" placeholder="Email" />
                <FormInput type="phone" placeholder="Teléfono" />
                <FormButton>Guardar</FormButton>
            </LogInForm>
        </LogInContainer>
    )
}