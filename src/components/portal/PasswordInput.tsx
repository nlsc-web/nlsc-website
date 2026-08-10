"use client";

import { EyeIcon, EyeOffIcon } from "@/components/portal/lms/icons";
import { lmsTokens } from "@/lib/portal/lms-tokens";
import {
  useState,
  type CSSProperties,
  type InputHTMLAttributes,
} from "react";

type PasswordInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  inputClassName?: string;
  inputStyle?: CSSProperties;
};

export default function PasswordInput({
  className,
  inputClassName,
  inputStyle,
  style,
  disabled,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={`relative ${className ?? ""}`.trim()} style={style}>
      <input
        {...props}
        type={visible ? "text" : "password"}
        disabled={disabled}
        className={`pr-11 ${inputClassName ?? ""}`.trim()}
        style={inputStyle}
      />
      <button
        type="button"
        tabIndex={-1}
        disabled={disabled}
        onClick={() => setVisible((current) => !current)}
        className="absolute inset-y-0 right-0 flex items-center px-3 disabled:opacity-50"
        aria-label={visible ? "Hide password" : "Show password"}
        title={visible ? "Hide password" : "Show password"}
      >
        {visible ? (
          <EyeOffIcon size={16} color={lmsTokens.slate} />
        ) : (
          <EyeIcon size={16} color={lmsTokens.slate} />
        )}
      </button>
    </div>
  );
}
