import MainLayout from "../../../layouts/MainLayout";
import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <MainLayout>
      <div className="container container-tight py-4">
        <div className="text-center mb-4">
          <a href="." className="navbar-brand navbar-brand-autodark">
            <img
              src="https://flynextbd.com/wp-content/uploads/2023/09/Fly-Next-PNG-abhaya-Lib-Font.png"
              height={36}
              alt="Fly Next"
            />
          </a>
        </div>
        <LoginForm />
        <div className="text-center text-muted mt-3">
          Don&apos;t have account yet?{" "}
          <a href="#" tabIndex={-1}>
            Register
          </a>
        </div>
      </div>
    </MainLayout>
  );
}
