import hoverSound from './sounds/hover.mp3'
import clickSound from './sounds/click.mp3'
import transitionSound from './sounds/transition.mp3'
import completeSound from './sounds/complete.mp3'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import Lenis from 'lenis'
import {
  FiArrowUpRight,
  FiCheck,
  FiTrash2,
  FiPlus,
} from 'react-icons/fi'
import './index.css'


function App() {
  const appRef = useRef(null)

  const [isLoading, setIsLoading] = useState(true)
  const [isSessionStarted, setIsSessionStarted] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [task, setTask] = useState('')


  const playSound = (sound, volume = 0.25) => {
    const audio = new Audio(sound)

    audio.volume = volume

    audio.currentTime = 0

    audio.play().catch(() => {
      // Browser may block audio before user interaction.
    })
  }

  const [tasks, setTasks] = useState([
    {
      id: 1,
      text: 'Design something meaningful',
      completed: false,
    },
    {
      id: 2,
      text: 'Build the experience',
      completed: false,
    },
    {
      id: 3,
      text: 'Finish what you started',
      completed: false,
    },
  ])

  useEffect(() => {
    if (!isSessionStarted) return

    const cards =
      document.querySelectorAll('.task-card')

    const handlers = []

    cards.forEach((card) => {
      const move = (event) => {
        const rect =
          card.getBoundingClientRect()

        const x =
          event.clientX -
          (rect.left + rect.width / 2)

        const y =
          event.clientY -
          (rect.top + rect.height / 2)

        gsap.to(card, {
          rotateY: x * 0.015,
          rotateX: -y * 0.015,
          duration: 0.4,
          ease: 'power3.out',
        })
      }

      const leave = () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.6,
          ease: 'power3.out',
        })
      }

      card.addEventListener(
        'mousemove',
        move
      )

      card.addEventListener(
        'mouseleave',
        leave
      )

      handlers.push({
        card,
        move,
        leave,
      })
    })

    return () => {
      handlers.forEach(
        ({
          card,
          move,
          leave,
        }) => {
          card.removeEventListener(
            'mousemove',
            move
          )

          card.removeEventListener(
            'mouseleave',
            leave
          )
        }
      )
    }
  }, [isSessionStarted, tasks])
  /* ─────────────────────────────────────────
     LENIS SMOOTH SCROLL
  ───────────────────────────────────────── */

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
    })

    let frameId

    const raf = (time) => {
      lenis.raf(time)
      frameId = requestAnimationFrame(raf)
    }

    frameId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frameId)
      lenis.destroy()
    }
  }, [])

  /* ─────────────────────────────────────────
     CINEMATIC LOADER
  ───────────────────────────────────────── */

  useEffect(() => {
    const counter = {
      value: 0,
    }

    const timeline = gsap.timeline({
      onComplete: () => {
        setIsLoading(false)
      },
    })

    timeline
      .to('.loader-counter', {
        opacity: 1,
        duration: 0.3,
      })
      .to(
        counter,
        {
          value: 100,
          duration: 1.8,
          ease: 'power2.inOut',
          onUpdate: () => {
            const element =
              document.querySelector('.loader-counter')

            if (element) {
              element.textContent =
                Math.round(counter.value)
            }
          },
        }
      )
      .to('.loader-counter', {
        opacity: 0,
        duration: 0.25,
      })
      .to(
        '.loader',
        {
          yPercent: -100,
          duration: 1.1,
          ease: 'power4.inOut',
        }
      )

    return () => {
      timeline.kill()
    }
  }, [])

  /* ─────────────────────────────────────────
     CINEMATIC CURSOR
  ───────────────────────────────────────── */

  useEffect(() => {
    if (isLoading) return

    const cursor = document.querySelector('.cursor')

    if (!cursor) return

    const moveCursor = (event) => {
      gsap.to(cursor, {
        x: event.clientX,
        y: event.clientY,
        duration: 0.35,
        ease: 'power3.out',
      })
    }

    const activateCursor = () => {
      cursor.classList.add('cursor-active')
    }

    const deactivateCursor = () => {
      cursor.classList.remove('cursor-active')
    }

    window.addEventListener(
      'mousemove',
      moveCursor
    )

    const interactiveElements =
      document.querySelectorAll(
        'button, input, .task-card'
      )

    interactiveElements.forEach((element) => {
      element.addEventListener(
        'mouseenter',
        activateCursor
      )

      element.addEventListener(
        'mouseleave',
        deactivateCursor
      )
    })

    return () => {
      window.removeEventListener(
        'mousemove',
        moveCursor
      )

      interactiveElements.forEach((element) => {
        element.removeEventListener(
          'mouseenter',
          activateCursor
        )

        element.removeEventListener(
          'mouseleave',
          deactivateCursor
        )
      })
    }
  }, [isLoading, isSessionStarted])

  /* ─────────────────────────────────────────
     AMBIENT LIGHT
  ───────────────────────────────────────── */

  useEffect(() => {
    if (isLoading) return

    const glow =
      document.querySelector('.ambient-glow')

    if (!glow) return

    const moveGlow = (event) => {
      const x =
        event.clientX - window.innerWidth / 2

      const y =
        event.clientY - window.innerHeight / 2

      gsap.to(glow, {
        x,
        y,
        duration: 1.2,
        ease: 'power3.out',
      })
    }

    window.addEventListener(
      'mousemove',
      moveGlow
    )

    return () => {
      window.removeEventListener(
        'mousemove',
        moveGlow
      )
    }
  }, [isLoading, isSessionStarted])

  /* ─────────────────────────────────────────
     LANDING PAGE CINEMATIC ENTRANCE
  ───────────────────────────────────────── */

  useEffect(() => {
    if (isSessionStarted || isLoading) return

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: {
          ease: 'power4.out',
        },
      })

      timeline
        .from('.hero', {
          y: '100%',
          duration: 1.2,
          ease: 'power4.inOut',
        })
        .from(
          '.eyebrow',
          {
            y: 30,
            opacity: 0,
            duration: 0.7,
          },
          '-=0.55'
        )
        .from(
          '.hero-title',
          {
            y: '120%',
            opacity: 0,
            duration: 1.2,
            ease: 'power4.out',
          },
          '-=0.45'
        )
        .from(
          '.hero-description',
          {
            y: 50,
            opacity: 0,
            duration: 0.8,
          },
          '-=0.65'
        )
        .from(
          '.start-button',
          {
            y: 40,
            opacity: 0,
            duration: 0.7,
          },
          '-=0.45'
        )
        .from(
          '.hero-footer',
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
          },
          '-=0.4'
        )
    }, appRef)

    return () => ctx.revert()
  }, [isSessionStarted, isLoading])

  /* ─────────────────────────────────────────
     MAGNETIC START BUTTON
  ───────────────────────────────────────── */

  useEffect(() => {
    if (
      isLoading ||
      isSessionStarted ||
      window.innerWidth <= 768
    ) {
      return
    }

    const button =
      document.querySelector('.start-button')

    if (!button) return

    const moveButton = (event) => {
      const rect =
        button.getBoundingClientRect()

      const x =
        event.clientX -
        (rect.left + rect.width / 2)

      const y =
        event.clientY -
        (rect.top + rect.height / 2)

      gsap.to(button, {
        x: x * 0.18,
        y: y * 0.18,
        duration: 0.4,
        ease: 'power3.out',
      })
    }

    const resetButton = () => {
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.4)',
      })
    }

    button.addEventListener(
      'mousemove',
      moveButton
    )

    button.addEventListener(
      'mouseleave',
      resetButton
    )

    return () => {
      button.removeEventListener(
        'mousemove',
        moveButton
      )

      button.removeEventListener(
        'mouseleave',
        resetButton
      )
    }
  }, [
    isLoading,
    isSessionStarted,
  ])

  /* ─────────────────────────────────────────
     START SESSION
  ───────────────────────────────────────── */

  const startSession = () => {
    playSound(transitionSound, 0.25)

    setIsTransitioning(true)

    setTimeout(() => {
      setIsSessionStarted(true)
    }, 700)

    setTimeout(() => {
      setIsTransitioning(false)
    }, 1400)
  }

  /* ─────────────────────────────────────────
     SESSION ENTRANCE
  ───────────────────────────────────────── */

  useEffect(() => {
    if (!isSessionStarted) return

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline()

      timeline
        .from('.session', {
          opacity: 0,
          y: 80,
          duration: 0.9,
          ease: 'power4.out',
        })
        .from(
          '.session-header',
          {
            y: 60,
            opacity: 0,
            duration: 0.8,
            ease: 'power4.out',
          },
          '-=0.45'
        )
        .from(
          '.task-form',
          {
            y: 30,
            opacity: 0,
            duration: 0.6,
          },
          '-=0.45'
        )
        .from(
          '.task-card',
          {
            y: 50,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power4.out',
          },
          '-=0.3'
        )
        .from(
          '.session-footer',
          {
            y: 20,
            opacity: 0,
            duration: 0.5,
          },
          '-=0.25'
        )
    })

    return () => ctx.revert()
  }, [isSessionStarted])

  /* ─────────────────────────────────────────
     ADD TASK
  ───────────────────────────────────────── */

  const addTask = (event) => {
    event.preventDefault()

    const trimmedTask = task.trim()

    if (!trimmedTask) return

    const newTask = {
      id: Date.now(),
      text: trimmedTask,
      completed: false,
    }

    setTasks((currentTasks) => [
      ...currentTasks,
      newTask,
    ])

    setTask('')

    setTimeout(() => {
      const cards =
        document.querySelectorAll(
          '.task-card'
        )

      const newCard =
        cards[cards.length - 1]

      if (!newCard) return

      gsap.fromTo(
        newCard,
        {
          x: 80,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
        }
      )
    }, 50)
  }

  /* ─────────────────────────────────────────
     COMPLETE TASK
  ───────────────────────────────────────── */

  const toggleTask = (id) => {
    const selectedTask = tasks.find(
      (item) => item.id === id
    )

    if (!selectedTask) return

    if (!selectedTask.completed) {
      playSound(completeSound, 0.2)
    }

    setTasks((currentTasks) =>
      currentTasks.map((item) =>
        item.id === id
          ? {
            ...item,
            completed: !item.completed,
          }
          : item
      )
    )
  }

  /* ─────────────────────────────────────────
     DELETE TASK
  ───────────────────────────────────────── */

  const deleteTask = (id) => {
    const card =
      document.querySelector(
        `[data-task-id="${id}"]`
      )

    if (!card) {
      setTasks((currentTasks) =>
        currentTasks.filter(
          (item) => item.id !== id
        )
      )

      return
    }

    gsap.to(card, {
      x: 100,
      opacity: 0,
      height: 0,
      duration: 0.45,
      ease: 'power3.in',
      onComplete: () => {
        setTasks((currentTasks) =>
          currentTasks.filter(
            (item) => item.id !== id
          )
        )
      },
    })
  }

  const remainingTasks = tasks.filter(
    (item) => !item.completed
  ).length

  /* ─────────────────────────────────────────
     LOADER
  ───────────────────────────────────────── */

  if (isLoading) {
    return (
      <div className="loader">
        <div className="loader-inner">
          <p className="loader-label">
            INITIALIZING FOCUS SYSTEM
          </p>

          <div className="loader-counter">
            0
          </div>

          <div className="loader-line">
            <span />
          </div>
        </div>
      </div>
    )
  }

  /* ─────────────────────────────────────────
     SESSION
  ───────────────────────────────────────── */

  if (isSessionStarted) {
    return (
      <>
        <div className="cursor" />

        <main className="app session-page">
          <section className="session">
            <div className="noise" />
            <div className="ambient-glow" />

            <header className="session-header">
              <div>
                <p className="session-label">
                  FOCUS SYSTEM
                </p>

                <h2>
                  YOUR
                  <br />
                  TASKS<span>.</span>
                </h2>
              </div>

              <div className="task-counter">
                <span>
                  {remainingTasks
                    .toString()
                    .padStart(2, '0')}
                </span>

                <p>REMAINING</p>
              </div>
            </header>

            <form
              className="task-form"
              onSubmit={addTask}
            >
              <input
                type="text"
                value={task}
                onChange={(event) =>
                  setTask(event.target.value)
                }
                placeholder="What needs your attention?"
              />

              <button type="submit">
                <FiPlus />
                ADD TASK
              </button>
            </form>

            <div className="task-list">
              {tasks.map((item, index) => (
                <div
                  className={`task-card ${item.completed
                    ? 'completed'
                    : ''
                    }`}
                  data-task-id={item.id}
                  key={item.id}
                >
                  <span className="task-number">
                    {(index + 1)
                      .toString()
                      .padStart(2, '0')}
                  </span>

                  <button
                    type="button"
                    className="complete-button"
                    onClick={() =>
                      toggleTask(item.id)
                    }
                  >
                    {item.completed && <FiCheck />}
                  </button>

                  <p>{item.text}</p>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() =>
                      deleteTask(item.id)
                    }
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
            </div>

            <footer className="session-footer">
              <span>STAY PRESENT.</span>
              <span>{tasks.length} TOTAL TASKS</span>
              <span>2026</span>
            </footer>
          </section>
        </main>
      </>
    )
  }
  /* ─────────────────────────────────────────
     LANDING PAGE
  ───────────────────────────────────────── */

  return (
    <>
      <div className="cursor" />

      <main
        className="app"
        ref={appRef}
      >
        {isTransitioning && (
          <div className="page-transition">
            <div className="transition-panel" />
            <span>ENTERING FOCUS</span>
          </div>
        )}
        <section className="hero">
          <div className="noise" />
          <div className="ambient-glow" />

          <div className="hero-content">
            <p className="eyebrow">
              PERSONAL PRODUCTIVITY SYSTEM — 2026
            </p>

            <div className="title-wrapper">
              <h1 className="hero-title">
                <span className="title-word">
                  FOCUS
                </span>
                <span className="title-dot">.</span>
              </h1>
            </div>

            <p className="hero-description">
              Clear your mind.
              <br />
              Finish what matters.
            </p>

            <button
              type="button"
              className="start-button"
              onMouseEnter={() =>
                playSound(hoverSound, 0.12)
              }
              onClick={() => {
                playSound(clickSound, 0.2)
                startSession()
              }}
            >
              START THE SESSION
              <FiArrowUpRight />
            </button>
          </div>

          <div className="hero-footer">
            <div>
              <span>01</span>
              <p>PROJECT</p>
            </div>

            <div>
              <span>
                {remainingTasks
                  .toString()
                  .padStart(2, '0')}
              </span>

              <p>TASKS WAITING</p>
            </div>

            <div>
              <span>2026</span>
              <p>EST. YEAR</p>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default App