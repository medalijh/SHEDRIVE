import Link from "next/link";

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50"
      style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(225,29,72,0.2)" }}>
      <div className="container-app mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 object-cover rounded-full border border-rose-200 overflow-hidden flex items-center justify-center bg-white flex-shrink-0"><img src="/logo.png" alt="SheDrive Logo" className="w-full h-full object-cover mix-blend-multiply scale-[1.15]" /></div>
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

export default function PrivacyPage() {
  return (
    <div style={{ background: "var(--color-silver-50)" }}>
      <Navbar />

      <section className="pt-28 pb-16 px-6 text-center bg-white relative overflow-hidden">
        <div className="zellige-pattern absolute inset-0 opacity-20"/>
        <div className="container-app mx-auto relative z-10">
          <span className="badge mb-6 text-xs" style={{ background: "rgba(225,29,72,0.15)", color: "var(--color-rose-400)", border: "1px solid rgba(225,29,72,0.3)" }}>POLITIQUE DE CONFIDENTIALITÉ</span>
          <h1 className="text-display-lg text-black mb-3">Vos données, <span className="gradient-text">protégées</span></h1>
          <p className="text-sm" style={{ color: "rgba(0,0,0,0.6)" }}>Dernière mise à jour : 1er Juin 2025</p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto card-luxury p-10">
          <Section title="1. Introduction">
            <p className="mb-4">
              SheDrive Morocco SAS (« SheDrive », « nous », « notre ») s'engage à protéger la vie privée des utilisatrices de son service de transport exclusivement féminin. La présente politique décrit les informations que nous collectons, comment nous les utilisons, et vos droits en vertu de la loi marocaine 09-08 et du RGPD européen.
            </p>
          </Section>

          <Section title="2. Données collectées">
            <p className="mb-3"><strong>Données d'identité :</strong> Nom complet, CIN, numéro de téléphone, email, photo de profil, selfie de vérification.</p>
            <p className="mb-3"><strong>Données de localisation :</strong> Position GPS en temps réel pendant les trajets, historique des adresses.</p>
            <p className="mb-3"><strong>Données de paiement :</strong> Informations de carte bancaire (traitées par CMI/Stripe, non stockées chez nous), historique des transactions.</p>
            <p className="mb-3"><strong>Données d'utilisation :</strong> Historique des trajets, notes, commentaires, comportements dans l'application.</p>
            <p><strong>Données du véhicule (conductrices) :</strong> Plaque d'immatriculation, permis de conduire, assurance, visite technique.</p>
          </Section>

          <Section title="3. Utilisation des données">
            <ul className="list-disc pl-5 space-y-2">
              <li>Fourniture et amélioration du service de transport</li>
              <li>Vérification d'identité et sécurité</li>
              <li>Traitement des paiements et gestion du wallet</li>
              <li>Alertes SOS et sécurité des trajets</li>
              <li>Communication (notifications, SMS, email)</li>
              <li>Conformité légale et résolution des litiges</li>
              <li>Amélioration algorithmique et analyse anonymisée</li>
            </ul>
          </Section>

          <Section title="4. Partage des données">
            <p className="mb-3">Nous ne vendons jamais vos données. Nous partageons uniquement :</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Avec les conductrices/passagères : informations limitées nécessaires au trajet (prénom, photo, note)</li>
              <li>Prestataires de paiement (CMI Maroc, Stripe) pour le traitement sécurisé</li>
              <li>Autorités marocaines uniquement sur réquisition légale</li>
              <li>Contacts d'urgence désignés lors d'une alerte SOS</li>
            </ul>
          </Section>

          <Section title="5. Sécurité des données">
            <p className="mb-3">Nous appliquons les mesures suivantes :</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Chiffrement AES-256 pour les données sensibles au repos</li>
              <li>TLS 1.3 pour toutes les communications</li>
              <li>Authentification multi-facteurs pour les comptes admin</li>
              <li>Audit de sécurité trimestriel et tests de pénétration</li>
              <li>Conformité OWASP Top 10 et ISO 27001</li>
            </ul>
          </Section>

          <Section title="6. Vos droits (Loi 09-08 / RGPD)">
            <p className="mb-3">Vous avez le droit de :</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Accès :</strong> Obtenir une copie de vos données personnelles</li>
              <li><strong>Rectification :</strong> Corriger des données inexactes</li>
              <li><strong>Effacement :</strong> Supprimer votre compte et vos données</li>
              <li><strong>Portabilité :</strong> Recevoir vos données dans un format structuré</li>
              <li><strong>Opposition :</strong> Refuser certains traitements</li>
            </ul>
            <p className="mt-4">Pour exercer ces droits : <a href="mailto:privacy@shedrive.ma" className="underline" style={{ color: "var(--color-rose-600)" }}>privacy@shedrive.ma</a></p>
          </Section>

          <Section title="7. Conservation des données">
            <p>Vos données sont conservées pendant la durée de votre relation avec SheDrive, plus 5 ans après la clôture de votre compte pour des raisons légales. Les données de localisation des trajets sont anonymisées après 12 mois.</p>
          </Section>

          <Section title="8. Contact DPO">
            <p>Déléguée à la Protection des Données : <a href="mailto:dpo@shedrive.ma" className="underline" style={{ color: "var(--color-rose-600)" }}>dpo@shedrive.ma</a></p>
            <p className="mt-2">SheDrive Morocco SAS · Maarif, Casablanca 20100 · Maroc</p>
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
