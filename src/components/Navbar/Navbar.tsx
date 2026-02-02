'use client'
import Link from 'next/link'
import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import menu from '../../../public/menu.svg'
import reservationsIcon from '../../../public/reservation-icon.svg'
import yourOffersIcon from '../../../public/offers-icon.svg'
import accountIcon from '../../../public/account-icon.svg'
import signInIconIcon from '../../../public/sign-in-icon.svg'

export default function Navbar({}) {
  const [open, setOpen] = useState(false)

  interface IMenuItem {
    name: string
    redirect: string
    icon: string
  }

  const menuItems: IMenuItem[] = [
    { name: 'Reservations', redirect: '/', icon: reservationsIcon }, //todo add proper redirects
    { name: 'Renting', redirect: '/', icon: yourOffersIcon },
    { name: 'Account', redirect: '/account', icon: accountIcon },
    { name: 'Sign In', redirect: '/sign-in', icon: signInIconIcon },
  ]
  const menuRef = useRef<HTMLInputElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        imgRef.current &&
        !imgRef.current.contains(e.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <nav>
      <div className="flex items-center justify-between">
        <Link href="/">
          <h1 className="navbar-logo">
            <b>PARKING</b>BOOKING
          </h1>
        </Link>
        <div className="relative">
          <Image
            className="h-30 pt-15 flex w-10 cursor-pointer"
            ref={imgRef}
            src={menu}
            alt="menu"
            onClick={() => setOpen((prev) => !prev)}
          />
          {open && (
            <div
              className="e-52 top-18 absolute -right-0 z-50 rounded-xl bg-deep-dusk p-4 text-slate-50"
              ref={menuRef}
            >
              <ul>
                {menuItems.map((element) => (
                  <li
                    onClick={() => setOpen(false)}
                    className="sm:min-w-800 md:min-w-620 w-620 cursor-pointer rounded p-1 text-lg hover:bg-purple-900"
                    key={element.name}
                  >
                    <span>
                      <Link
                        className="flex items-center space-x-2 p-2"
                        href={element.redirect}
                      >
                        <Image className="" src={element.icon} alt="menu" />
                        <div className="inline text-right text-xl">
                          <span>{element.name} </span>
                        </div>
                      </Link>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
