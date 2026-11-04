export function StateView({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center gap-1 px-6 py-16 text-center">
      <h2 className="font-semibold">{title}</h2>
      {description && <p className="text-sm text-muted">{description}</p>}
    </div>
  );
}
