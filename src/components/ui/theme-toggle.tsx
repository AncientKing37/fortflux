
import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const [theme, setTheme] = React.useState<"light" | "dark">("light")

  React.useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle("dark", savedTheme === "dark")
    } else {
      // Check system preference
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setTheme("dark")
        document.documentElement.classList.add("dark")
      }
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-5 w-5 text-muted-foreground" />
      <Button
        variant="outline"
        size="icon"
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="relative h-8 w-14 rounded-full"
      >
        <div className={`absolute inset-0 flex items-center transition-all duration-300 ${theme === 'dark' ? 'justify-end' : 'justify-start'}`}>
          <div className={`h-6 w-6 rounded-full transform transition-all duration-300 ${theme === 'dark' ? 'bg-primary translate-x-[-4px]' : 'bg-primary translate-x-[4px]'}`} />
        </div>
      </Button>
      <Moon className="h-5 w-5 text-muted-foreground" />
    </div>
  )
}
