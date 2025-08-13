export default function Footer() {
  return (
    <footer className="text-center   py-10  space-y-4">
      {/* <p>
        <span className="font-bold font-fredoka">Jeda</span> by{" "}
        <a
          href="https://fadils.xyz"
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Fadils.xyz
        </a>
      </p> */}
      <p className="text-md text-muted-foreground">
        &copy; {new Date().getFullYear()} <a href="https://github.com/anypeace-oss" className="hover:text-blue-400 transition-all">Anypeace</a>
      </p>
    </footer>
  );
}
