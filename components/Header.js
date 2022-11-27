import Link from 'next/link'

const Header = () => {
  return (
    <header className="w-full bg-white shadow-sm shadow-slate-700 h-16 fixed">
      <div className="flex flex-row px-2 items-center h-full">
        <Link href="/">Home</Link>
      </div>
      <div className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-red-400 to-slate-800"></div>
    </header>
  )
}

export default Header
