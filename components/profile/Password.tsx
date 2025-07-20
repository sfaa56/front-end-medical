import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { password } from "@/features/auth/authSlice";
import { toast } from "sonner";

function Password() {
  const { error, passwordLoading } = useSelector(
    (state: RootState) => state.auth
  );

  const dispatch = useDispatch<AppDispatch>();

  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const validatePasswords = () => {
    const errs: { [key: string]: string } = {};
    if (!passwords.oldPassword) errs.oldPassword = "Old password required";
    if (!passwords.newPassword || passwords.newPassword.length < 6)
      errs.newPassword = "New password must be at least 6 characters";
    if (passwords.newPassword !== passwords.confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const [passwordErrors, setPasswordErrors] = useState<{
    [key: string]: string;
  }>({});

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    // Dummy: just close modal


    e.preventDefault();
    const validationErrors = validatePasswords();
    if (Object.keys(validationErrors).length > 0) {
      setPasswordErrors(validationErrors);
      return;
    }
    setPasswordErrors({});

    try {
      const resultAction = await dispatch(password(passwords));

      if (password.fulfilled.match(resultAction)) {
        const passworddated = resultAction.payload;
         toast("Password updated successfully");
         setPasswords({oldPassword:"",newPassword:"",confirmPassword:""})

      } else {
        console.log("error", error);
        //  Get error directly from resultAction
        if (resultAction.payload) {
          console.log("updated failed:", resultAction.payload); // e.g. { error: "Invalid credentials" }
          toast("Change Password failed");
        }
      }
    } catch (error) {
          console.log("Unexpected error during login:", error);
              toast("something went wrong");

    }
  };
  return (
    <section className="border-t pt-6">
      <h2 className="font-semibold mb-2 text-secondary">Change Password</h2>
      <form onSubmit={handlePasswordSubmit} className="space-y-3">
        <div>
          <label className="block mb-1 font-medium">Old Password</label>
          <input
            className="w-full border rounded px-3 py-2"
            name="oldPassword"
            type={showPassword ? "text" : "password"}
            value={passwords.oldPassword}
            onChange={handlePasswordChange}
            required
          />
          {passwordErrors.oldPassword && (
            <span className="text-red-500 text-xs">
              {passwordErrors.oldPassword}
            </span>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium">New Password</label>
          <input
            className="w-full border rounded px-3 py-2"
            name="newPassword"
            type={showPassword ? "text" : "password"}
            value={passwords.newPassword}
            onChange={handlePasswordChange}
            required
          />
          {passwordErrors.newPassword && (
            <span className="text-red-500 text-xs">
              {passwordErrors.newPassword}
            </span>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium">Confirm New Password</label>
          <input
            className="w-full border rounded px-3 py-2"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            value={passwords.confirmPassword}
            onChange={handlePasswordChange}
            required
          />
        </div>
        {passwordErrors.confirmPassword && (
          <span className="text-red-500 text-xs">
            {passwordErrors.confirmPassword}
          </span>
        )}

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword((v) => !v)}
            className="accent-secondary w-5 h-5"
            id="showPass"
          />

          <label htmlFor="showPass">Show Passwords</label>
        </div>
        <div className="flex gap-3 mt-2">
          <Button
            type="submit"
            className="bg-secondary text-white mt-5 hover:bg-secondary/90"
          >
            Save Password
          </Button>
        </div>
      </form>
    </section>
  );
}

export default Password;
