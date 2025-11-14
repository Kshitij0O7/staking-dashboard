import Link from "next/link";

const links = [
  {
    label: "Sign up to Bitquery",
    href: "https://ide.bitquery.io/?utm_source=github&utm_medium=footer&utm_campaign=staking-dashboard",
  },
  {
    label: "Access Token",
    href: "https://account.bitquery.io/user/api_v2/access_tokens?utm_source=github&utm_medium=footer&utm_campaign=staking-dashboard",
  },
  {
    label: "Staking API Docs",
    href: "https://docs.bitquery.io/docs/blockchain/Ethereum/balances/transaction-balance-tracker/eth-validator-balance-tracker/?utm_source=github&utm_medium=footer&utm_campaign=staking-dashboard",
  },
  {
    label: "Contact",
    href: "https://t.me/Bloxy_info/?utm_source=github&utm_medium=footer&utm_campaign=staking-dashboard",
  },
  {
    label: "npm Package",
    href: "https://www.npmjs.com/package/staking-rewards-api?utm_source=github&utm_medium=footer&utm_campaign=staking-dashboard",
  },
  {
    label: "GitHub Repo",
    href: "https://github.com/Kshitij0O7/staking-dashboard?utm_source=github&utm_medium=footer&utm_campaign=staking-dashboard",
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200/60 bg-white/80 px-6 py-8 text-sm text-zinc-600 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/70 dark:text-zinc-300">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="https://bitquery.io/?utm_source=github&utm_medium=footer&utm_campaign=staking-dashboard" target="_blank" rel="noopener noreferrer">
        <p className="text-xs uppercase tracking-[0.4em] text-emerald-500">
          Built with Bitquery
        </p>
        </Link>
        <ul className="flex flex-wrap items-center gap-4 text-xs font-medium uppercase tracking-wide">
          {links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 underline-offset-4 hover:underline dark:text-emerald-300"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

