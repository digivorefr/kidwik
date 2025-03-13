function Footer() {
  return (
    <footer className="bg-[var(--kiwi-chocolate)] text-white p-6">
      <div className="container mx-auto">
        <p className="text-center">© {new Date().getFullYear()} KidWik - Tous droits réservés</p>
      </div>
    </footer>
  )
}

export default Footer