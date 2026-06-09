import Link from "next/link";

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50"
      style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(225,29,72,0.2)" }}>
      <div className="container-app mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 object-cover rounded-full border border-rose-200 overflow-hidden flex items-center justify-center bg-white flex-shrink-0"><img src="/logo.png" alt="SheDrive Logo" className="w-full h-full object-cover mix-blend-multiply scale-[1.35]" /></div>
          <span className="text-lg font-bold text-black" style={{ fontFamily: "var(--font-display)" }}>SheDrive Morocco</span>
        </Link>
        <Link href="/auth/register" className="btn btn-sm btn-primary">S'inscrire</Link>
      </div>
    </nav>
  );
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-10">
    <h2 className="text-xl font-semibold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-rose-700)" }}>{title}</h2>
    <div className="text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>{children}</div>
  </div>
);

export default function TermsPage() {
  return (
    <div style={{ background: "var(--color-silver-50)" }}>
      <Navbar />

      <section className="pt-28 pb-16 px-6 text-center bg-white relative overflow-hidden">
        <div className="zellige-pattern absolute inset-0 opacity-20"/>
        <div className="container-app mx-auto relative z-10">
          <span className="badge mb-6 text-xs" style={{ background: "rgba(225,29,72,0.15)", color: "var(--color-rose-400)", border: "1px solid rgba(225,29,72,0.3)" }}>CONDITIONS D'UTILISATION</span>
          <h1 className="text-display-lg text-black mb-3">Nos <span className="gradient-text">Engagements</span></h1>
          <p className="text-sm" style={{ color: "rgba(0,0,0,0.6)" }}>Dernière mise à jour : 1er Juin 2025</p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto card-luxury p-10">
          <Section title="1. Acceptation des conditions">
            <p>En utilisant l'application SheDrive Morocco, vous acceptez les présentes conditions générales d'utilisation (CGU). Ces conditions constituent un contrat juridiquement contraignant entre vous et SheDrive Morocco SAS, conformément au droit marocain.</p>
          </Section>

          <Section title="2. Éligibilité et accès">
            <p className="mb-3">Pour utiliser SheDrive Morocco, vous devez :</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Être une femme identifiée (passagère ou conductrice)</li>
              <li>Avoir au moins 18 ans</li>
              <li>Disposer d'un numéro de téléphone marocain valide</li>
              <li>Résider ou voyager au Maroc</li>
              <li>Fournir des informations exactes et authentiques lors de l'inscription</li>
            </ul>
            <p className="mt-4"><strong>SheDrive est un service exclusivement féminin.</strong> Toute tentative de fraude sur l'identité entraîne une interdiction permanente et peut faire l'objet de poursuites légales.</p>
          </Section>

          <Section title="3. Service de mise en relation">
            <p className="mb-3">SheDrive est une plateforme de mise en relation. Nous ne sommes pas un transporteur. Les conductrices sont des prestataires indépendantes. SheDrive :</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Facilite la mise en relation entre passagères et conductrices</li>
              <li>Vérifie les identités et documents des conductrices</li>
              <li>Fournit des outils de sécurité (SOS, suivi GPS, appel masqué)</li>
              <li>Traite les paiements électroniques</li>
              <li>Gère les litiges selon la procédure interne</li>
            </ul>
          </Section>

          <Section title="4. Prix et paiement">
            <p className="mb-3">Le système SheDrive utilise un modèle de négociation libre :</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>La passagère propose un prix</li>
              <li>La conductrice peut accepter ou contre-proposer</li>
              <li>L'accord est définitif une fois le trajet confirmé</li>
              <li>SheDrive prélève une commission de 15% sur chaque trajet</li>
              <li>Aucun remboursement n'est possible sauf en cas de défaillance de service</li>
            </ul>
          </Section>

          <Section title="5. Responsabilité conductrice">
            <p className="mb-3">En tant que conductrice, vous vous engagez à :</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Maintenir votre véhicule en bon état et assuré</li>
              <li>Respecter le Code de la route marocain en toutes circonstances</li>
              <li>Ne pas modifier ou annuler les trajets de manière abusive</li>
              <li>Traiter les passagères avec respect et professionnalisme</li>
              <li>Ne pas partager les informations des passagères</li>
            </ul>
          </Section>

          <Section title="6. Comportement interdit">
            <p className="mb-3">Sont strictement interdits :</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Usurpation d'identité ou fraude documentaire</li>
              <li>Harcèlement, discrimination ou comportement irrespectueux</li>
              <li>Transport de substances illicites</li>
              <li>Manipulation du système de notation</li>
              <li>Utilisation de l'application à des fins commerciales non autorisées</li>
              <li>Toute activité contraire à la loi marocaine</li>
            </ul>
          </Section>

          <Section title="7. Annulations et no-shows">
            <p>Les annulations tardives (après 2 minutes de confirmation) peuvent entraîner des frais de 5 MAD. Les passagères ou conductrices avec un taux d'annulation supérieur à 30% peuvent voir leur compte suspendu.</p>
          </Section>

          <Section title="8. Limitation de responsabilité">
            <p>SheDrive Morocco ne peut être tenu responsable des dommages indirects, pertes de données, ou préjudices résultant de l'utilisation du service. Notre responsabilité directe est limitée au montant du trajet concerné.</p>
          </Section>

          <Section title="9. Résiliation">
            <p>SheDrive se réserve le droit de suspendre ou résilier tout compte sans préavis en cas de violation des présentes CGU. Vous pouvez supprimer votre compte à tout moment depuis les paramètres.</p>
          </Section>

          <Section title="10. Droit applicable">
            <p>Les présentes CGU sont régies par le droit marocain. Tout litige sera soumis à la juridiction compétente de Casablanca, Maroc.</p>
            <p className="mt-4">Contact : <a href="mailto:legal@shedrive.ma" className="underline" style={{ color: "var(--color-rose-600)" }}>legal@shedrive.ma</a></p>
          </Section>
        </div>
      </section>

      <footer style={{ background: "#F3F4F6", color: "rgba(0,0,0,0.6)" }}>
        <div className="container-app mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg,var(--color-rose-500),var(--color-rose-700))" }}>🌹</div>
            <span className="font-bold text-black" style={{ fontFamily: "var(--font-display)" }}>SheDrive Morocco</span>
          </div>
          <p className="text-xs">© 2025 SheDrive Morocco. Tous droits réservés. 🇲🇦</p>
        </div>
      </footer>
    </div>
  );
}
