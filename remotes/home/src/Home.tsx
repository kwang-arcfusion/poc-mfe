import '@material/web/textfield/filled-text-field.js';
import './styles.css';

export default function Home() {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-medium">Home</h2>

      <md-filled-text-field
        label="Your name"
        onInput={(e) => {
          const el = e.target as HTMLInputElement | null;
          if (el) console.log(el.value);
        }}
      />
      <p className="text-sm text-neutral-600">This is the same in host & standalone.</p>
    </section>
  );
}
