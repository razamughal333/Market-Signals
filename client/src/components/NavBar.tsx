import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/search', label: 'Search' },
  { to: '/about', label: 'About' },
];

export default function NavBar() {
  return (
    <nav className="mx-auto flex max-w-4xl items-center gap-1 px-6 pt-8">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          className={({ isActive }) =>
            `rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-white text-slate-900'
                : 'text-slate-400 hover:text-white'
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
