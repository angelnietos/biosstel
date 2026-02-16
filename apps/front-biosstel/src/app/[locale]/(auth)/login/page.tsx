/**
 * Login Page - Updated to use new architecture
 */
import { CenteredLayout } from '@biosstel/ui-layout';
import { Input, InputPassword, ErrorFormMsg } from '@biosstel/ui';

export default function LoginPage() {
  return (
    <CenteredLayout>
      <h1 className="mb-8 text-h1 font-semibold text-black">Login</h1>
      <form className="flex flex-col gap-4">
        <div>
          <Input 
            name="username" 
            placeholder="Username" 
            className="h-[43px] w-full rounded-lg border border-border-input bg-transparent px-3"
          />
        </div>
        <div>
          <InputPassword 
            name="password" 
            placeholder="Password"
            className="h-[43px] w-full rounded-lg border border-border-input bg-transparent px-3"
          />
        </div>
        <button 
          type="submit"
          className="mt-4 h-[43px] w-full rounded-lg bg-button-primary text-body text-white"
        >
          Login
        </button>
      </form>
    </CenteredLayout>
  );
}
