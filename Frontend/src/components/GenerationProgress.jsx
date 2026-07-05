import { useEffect, useState } from "react"
import "../style/progress.scss"

const STEPS = [
    "Analyzing Resume...",
    "Extracting Skills...",
    "Matching Job Description...",
    "Generating Questions...",
    "Creating Roadmap...",
]

const GenerationProgress = () => {
    const [stepIndex, setStepIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setStepIndex((i) => (i < STEPS.length - 1 ? i + 1 : i))
        }, 4500)
        return () => clearInterval(interval)
    }, [])

    return (
        <main className="generation-progress">
            <div className="generation-progress__card">
                <div className="generation-progress__spinner" />
                <h1>Building your interview strategy</h1>
                <ul>
                    {STEPS.map((step, i) => (
                        <li
                            key={step}
                            className={
                                i < stepIndex
                                    ? "generation-progress__step--done"
                                    : i === stepIndex
                                      ? "generation-progress__step--active"
                                      : ""
                            }
                        >
                            {step}
                        </li>
                    ))}
                </ul>
            </div>
        </main>
    )
}

export default GenerationProgress
