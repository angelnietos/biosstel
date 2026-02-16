import { AddUserForm } from '@biosstel/users';

export default function AddUserPage() {
  const handleSubmit = async (values: {
    name: string;
    email: string;
    last_name: string;
    phone: string;
    role: string;
  }) => {
    console.log('Add user:', values);
    // TODO: Implementar lógica de creación de usuario
  };

  return <AddUserForm onSubmit={handleSubmit} />;
}
