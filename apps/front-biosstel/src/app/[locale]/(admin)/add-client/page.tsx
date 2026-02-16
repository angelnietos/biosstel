import { AddClientForm } from '@biosstel/users';

export default function AddClientPage() {
  const handleSubmit = async (values: {
    name: string;
    email: string;
    phone: string;
  }) => {
    console.log('Add client:', values);
    // TODO: Implementar lógica de creación de cliente
  };

  return <AddClientForm onSubmit={handleSubmit} />;
}
