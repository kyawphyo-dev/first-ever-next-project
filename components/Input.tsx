function Input({
  label,
  placeholder,
  type,
  id,
}: {
  label?: string;
  placeholder: string;
  type: string;
  id?: string;
}) {
  return (
    <div className="space-y-3">
      {label && <label htmlFor={id}>{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        className="flex h-10 w-full rounded-md border border-border bg-input-background px-3 py-2 text-sm text-main-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background transition-colors"
        name=""
        id={id}
      />
    </div>
  );
}

export default Input;
