export default function Footer() {
  return (
    <footer className="text-center text-sm  py-10  space-y-4">
      <p>
        <span className="font-bold font-fredoka">Jeda</span> by{" "}
        <a
          href="https://fadils.xyz"
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Fadils.xyz
        </a>
      </p>
      <p className="text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Jeda. All rights reserved.
      </p>
    </footer>
  );
}
