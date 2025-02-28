import React from "react";

type FormProps = React.PropsWithChildren<{
  onSubmit: (data: any) => void;
}>;

export const Form: React.FC<FormProps> = ({ children, onSubmit }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData.entries());
        onSubmit(data);
      }}
    >
      {children}
    </form>
  );
};
