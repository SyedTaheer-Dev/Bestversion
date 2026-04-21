import { motion } from "framer-motion";

type SectionShowcaseProps = {
  imageSrc: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  description: string;
  reverse?: boolean;
};

const SectionShowcase = ({ imageSrc, imageAlt, eyebrow, title, description, reverse = false }: SectionShowcaseProps) => {
  return (
    <div className={`mb-12 grid items-start gap-8 lg:gap-12 ${reverse ? "lg:grid-cols-[0.98fr_1.02fr]" : "lg:grid-cols-[1.02fr_0.98fr]"}`}>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        className={`order-2 ${reverse ? "lg:order-2" : "lg:order-1"}`}
      >
        <div className="mx-auto max-w-[560px] rounded-[30px] border border-border/60 bg-card/65 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.16)] backdrop-blur-xl md:p-5">
          <div className="overflow-hidden rounded-[24px] border border-primary/12 bg-background/80">
            <div className="aspect-[16/10] w-full">
              <img
                src={imageSrc}
                alt={imageAlt}
                loading="lazy"
                decoding="async"
                width={1200}
                height={760}
                className="block h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: reverse ? -16 : 16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        className={`order-1 flex h-full items-center ${reverse ? "lg:order-1" : "lg:order-2"}`}
      >
        <div className="mx-auto max-w-xl text-left lg:mx-0">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
            {eyebrow}
          </div>
          <h3 className="mt-4 font-display text-2xl font-bold text-foreground md:text-[2rem] md:leading-tight">{title}</h3>
          <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
            {description}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SectionShowcase;
