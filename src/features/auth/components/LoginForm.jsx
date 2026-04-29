import { useState } from "react";
import { useAuthContext } from "../../../contexts/AuthContext";
import { validateLoginForm } from "../../../utils/validation";
import { AUTH_COPY } from "../constants/auth.constants";

const DEFAULT_FORM = {
  email: "",
  password: "",
  rememberMe: true,
};

export default function LoginForm() {
  const { loginMutation } = useAuthContext();
  const [formValues, setFormValues] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { checked, name, type, value } = event.target;

    if (loginMutation.error) {
      loginMutation.reset();
    }

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formErrors = validateLoginForm(formValues);
    setErrors(formErrors);

    if (Object.keys(formErrors).length) {
      return;
    }

    await loginMutation.mutateAsync(formValues);
  };

  return (
    <div className="card card-md">
      <div className="card-body">
        <h2 className="h2 text-center mb-4">{AUTH_COPY.pageTitle}</h2>
        {AUTH_COPY.pageSubtitle ? (
          <p className="text-secondary text-center mb-4">{AUTH_COPY.pageSubtitle}</p>
        ) : null}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              name="email"
              type="email"
              className={`form-control${errors.email ? " is-invalid" : ""}`}
              placeholder="your@email.com"
              autoComplete="off"
              value={formValues.email}
              onChange={handleChange}
            />
            {errors.email ? (
              <div className="invalid-feedback d-block">{errors.email}</div>
            ) : null}
          </div>
          <div className="mb-2">
            <label className="form-label">
              Password
              <span className="form-label-description">
                <a href="#">{AUTH_COPY.forgotPassword}</a>
              </span>
            </label>
            <div className="input-group input-group-flat">
              <input
                name="password"
                type="password"
                className={`form-control${errors.password ? " is-invalid" : ""}`}
                placeholder="Your password"
                autoComplete="off"
                value={formValues.password}
                onChange={handleChange}
              />
            </div>
            {errors.password ? (
              <div className="invalid-feedback d-block">{errors.password}</div>
            ) : null}
          </div>
          <div className="mb-2">
            <label className="form-check">
              <input
                name="rememberMe"
                type="checkbox"
                className="form-check-input"
                checked={formValues.rememberMe}
                onChange={handleChange}
              />
              <span className="form-check-label">{AUTH_COPY.rememberMeLabel}</span>
            </label>
          </div>
          <div className="form-footer">
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Signing in..." : AUTH_COPY.signInLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
