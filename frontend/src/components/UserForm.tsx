import { useEffect, useState, useCallback } from "react";
import { api } from "../api";
import "../styles/UserForm.css";

interface UserFormProps {
  mode: "add" | "edit";
  userId?: string;
  onSuccess: () => void;
}

type Errors = Partial<Record<
  | "customerNumber"
  | "username"
  | "firstName"
  | "lastName"
  | "email"
  | "dateOfBirth"
  | "password"
  | "repeatPassword"
, string>>;

const usernameRe = /^[A-Za-z0-9]{3,30}$/;
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isFuture = (d: Date) => d.getTime() > Date.now();

interface FieldProps {
  name:
    | "customerNumber"
    | "username"
    | "firstName"
    | "lastName"
    | "email"
    | "dateOfBirth"
    | "password"
    | "repeatPassword"
    | "lastLogin";
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  readOnly?: boolean;
  required?: boolean;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

function Field({
  name,
  label,
  type = "text",
  placeholder,
  value,
  readOnly = false,
  required = false,
  error,
  onChange,
  onBlur,
}: FieldProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
      <label
        htmlFor={name}
        style={{
          fontWeight: 600,
          marginBottom: "4px",
          color: "#222",
        }}
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        readOnly={readOnly}
        autoComplete={
    name === "password" || name === "repeatPassword"
      ? "new-password"
      : "off"
  }
        style={{
          padding: "8px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          fontSize: "14px",
        }}
      />

      {error && (
        <p style={{ color: "red", margin: "4px 0 0", fontSize: "13px" }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default function UserForm({ mode, userId, onSuccess }: UserFormProps) {
  const isEdit = mode === "edit";

  const [formData, setFormData] = useState({
    customerNumber: "",
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    password: "",
    repeatPassword: "",
    lastLogin: mode === "add" ? new Date().toISOString() : "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [errorBanner, setErrorBanner] = useState("");
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit && userId) {
      api
        .get(`/users/${userId}`)
        .then((res) => {
          const u = res.data;
          setFormData({
            customerNumber: String(u.customerNumber ?? ""),
            username: u.username ?? "",
            firstName: u.firstName ?? "",
            lastName: u.lastName ?? "",
            email: u.email ?? "",
            dateOfBirth: u.dateOfBirth ? u.dateOfBirth.split("T")[0] : "",
            password: "",
            repeatPassword: "",
            lastLogin: u.lastLogin
              ? new Date(u.lastLogin).toLocaleString()
              : "-",
          });
        })
        .catch(() => setErrorBanner("Failed to load user data"))
        .finally(() => setLoading(false));
    }
  }, [isEdit, userId]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
    setErrors((es) => ({ ...es, [name]: undefined }));
    setErrorBanner("");
  }, []);


  const validateField = (name: keyof typeof formData, value: string): string | undefined => {
    switch (name) {
      case "customerNumber":
        if (!/^\d{5}$/.test(value)) return "Customer Number must be exactly 5 digits.";
        return;
      case "username":
        if (!usernameRe.test(value)) return "Username must be 3–30 alphanumeric characters.";
        return;
      case "firstName":
        if (value.length < 2 || value.length > 150) return "First Name must be 2–150 characters.";
        return;
      case "lastName":
        if (value.length < 2 || value.length > 150) return "Last Name must be 2–150 characters.";
        return;
      case "email":
        if (value.length > 300) return "Email must be ≤ 300 characters.";
        if (!emailRe.test(value)) return "Email format is invalid.";
        return;
      case "dateOfBirth":
        if (!value) return "Date of Birth is required.";
        try {
          const d = new Date(value + "T00:00:00");
          if (Number.isNaN(d.getTime())) return "Invalid date.";
          if (isFuture(d)) return "Date of Birth cannot be in the future.";
        } catch {
          return "Invalid date.";
        }
        return;
      case "password":
        if (isEdit && !value) return;
        if (value.length < 8 || value.length > 150) return "Password must be 8–150 characters.";
        return;
      case "repeatPassword":
        if (isEdit && !formData.password && !value) return;
        if (value !== formData.password) return "Passwords do not match.";
        return;
      default:
        return;
    }
  };

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const msg = validateField(name as keyof typeof formData, value);
    setErrors((es) => ({ ...es, [name]: msg }));
  }, [formData]);

  const validateAll = (): boolean => {
    const next: Errors = {};
    ([
      "customerNumber",
      "username",
      "firstName",
      "lastName",
      "email",
      "dateOfBirth",
      "password",
      "repeatPassword",
    ] as const).forEach((k) => {
      const msg = validateField(k, (formData as any)[k]);
      if (msg) next[k] = msg;
    });
    if (isEdit && !formData.password) {
      delete next.password;
      delete next.repeatPassword;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorBanner("");
    if (!validateAll()) return;

    try {
      const { repeatPassword, lastLogin, ...dataToSend } = formData as any;
      if (!isEdit && lastLogin) dataToSend.lastLogin = lastLogin;
      if (isEdit && !dataToSend.password) delete dataToSend.password;

      if (isEdit) {
        await api.put(`/users/${userId}`, dataToSend);
        alert("User updated successfully!");
      } else {
        await api.post("/users", dataToSend);
        alert("User added successfully!");
      }
      onSuccess();
    } catch (err: any) {
      const code = err?.response?.data?.details?.code || err?.response?.data?.code || err?.code;
      const target = err?.response?.data?.details?.meta?.target as string | undefined;

      if (code === "P2002" && target) {
        setErrorBanner(`Duplicate value for ${target}.`);
        const fields = Array.isArray(target) ? target : [target];
        const next: Errors = { ...errors };
        fields.forEach((f) => (next[f as keyof Errors] = "Already exists."));
        setErrors(next);
      } else {
        setErrorBanner(err?.response?.data?.error || "Failed to submit form.");
      }
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="user-form-container">
      <h2>{isEdit ? "Edit User" : "Add User"}</h2>
      <form className="user-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {errorBanner && <div style={{ color: "red" }}>{errorBanner}</div>}

      <div className="field-group">
        <Field
        name="customerNumber"
        label="Customer Number"
        placeholder="5 digits"
        value={formData.customerNumber}
        onChange={handleChange}
        onBlur={handleBlur}
        readOnly={isEdit}
        required
        error={errors.customerNumber}
      />
      </div>

      <div className="field-group">
        <Field
        name="username"
        label="Username"
        placeholder="3–30 alphanumeric"
        value={formData.username}
        onChange={handleChange}
        onBlur={handleBlur}
        readOnly={isEdit}
        required
        error={errors.username}
      />
      </div>
      <div className="field-row">
        <div className="field-group">
          <Field
        name="firstName"
        label="First Name"
        value={formData.firstName}
        onChange={handleChange}
        onBlur={handleBlur}
        required
        error={errors.firstName}
      />
        </div>
        <div className="field-group">
          <Field
        name="lastName"
        label="Last Name"
        value={formData.lastName}
        onChange={handleChange}
        onBlur={handleBlur}
        required
        error={errors.lastName}
      />
        </div>

      </div>
      
      <div className="field-group">
        <Field
        name="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={formData.email}
        onChange={handleChange}
        onBlur={handleBlur}
        required
        error={errors.email}
      />
      </div>

      <div className="field-group">
        <Field
        name="dateOfBirth"
        label="Date of Birth (DD.MM.YYYY)"
        type="date"
        value={formData.dateOfBirth}
        onChange={handleChange}
        onBlur={handleBlur}
        required
        error={errors.dateOfBirth}
      />
      </div>

      
      
      {isEdit && (
        <div className="field-group">
        <Field
          name="lastLogin"
          label="Last Login"
          value={formData.lastLogin}
          onChange={handleChange}
          onBlur={handleBlur}
          readOnly
        />
      </div>
      )}

      <div className="row">
        <div className="field-group">
        <Field
        name="password"
        label="Password"
        type="password"
        placeholder={isEdit ? "New Password (optional, 8–150)" : "Password (8–150)"}
        value={formData.password}
        onChange={handleChange}
        onBlur={handleBlur}
        required={!isEdit}
        error={errors.password}
      />
      </div>

      <div className="field-group">
        <Field
        name="repeatPassword"
        label="Repeat Password"
        type="password"
        placeholder="Repeat Password"
        value={formData.repeatPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        required={!isEdit}
        error={errors.repeatPassword}
      />
      </div>

      </div>

      <button type="submit">{isEdit ? "Save Changes" : "Create User"}</button>
    </form>
    </div>
    
  );
}
