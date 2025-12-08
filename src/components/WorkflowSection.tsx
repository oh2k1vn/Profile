import { Code, PenTool, Rocket, Search } from 'lucide-react'

const steps = [
  {
    id: '01',
    title: 'Discovery & Analysis',
    icon: Search,
    description:
      'I begin by deeply understanding business requirements. Leveraging my background in E-commerce and Booking systems, I rigorously analyze edge-cases before writing a single line of code.',
  },
  {
    id: '02',
    title: 'Architecture Design',
    icon: PenTool,
    description:
      'Planning the project structure. Whether it’s Clean Architecture for Flutter or a Modular approach for React, I ensure the codebase remains scalable and maintainable.',
  },
  {
    id: '03',
    title: 'Development',
    icon: Code,
    description:
      'Writing Clean Code and optimizing performance during development. I integrate CI/CD pipelines and Unit Testing to minimize production bugs.',
  },
  {
    id: '04',
    title: 'Optimization & Launch',
    icon: Rocket,
    description:
      'Measuring Core Web Vitals or FPS metrics. I refactor and fine-tune the product to achieve peak performance before final delivery to users.',
  },
]

export default function WorkflowSection() {
  return (
    <section className="py-24 bg-background relative">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            How I <span className="text-blue-500">Work</span>
          </h2>
          <p className="text-muted-foreground">
            The process of turning complex requirements into high quality
            products.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting Line (Desktop only) */}
          <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-linear-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 -z-10" />

          {steps.map((step, index) => (
            <div key={index} className="group relative bg-background pt-8">
              {/* Step Number */}
              <div className="text-6xl font-black text-secondary/40 absolute -top-4 -left-2 select-none group-hover:text-blue-500/10 transition-colors">
                {step.id}
              </div>

              {/* Icon */}
              <div className="w-16 h-16 mx-auto bg-secondary rounded-2xl flex items-center justify-center mb-6 border border-border group-hover:border-blue-500 group-hover:bg-blue-500/10 transition-all duration-300 shadow-lg group-hover:shadow-blue-500/20">
                <step.icon
                  size={32}
                  className="text-foreground group-hover:text-blue-500 transition-colors"
                />
              </div>

              {/* Content */}
              <div className="text-center px-4">
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
