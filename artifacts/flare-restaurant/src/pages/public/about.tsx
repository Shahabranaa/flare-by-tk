export function About() {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-[45vh] min-h-[320px] w-full flex items-center justify-center text-center">
        <div className="absolute inset-0 bg-black">
          <img
            src="/hero-bbq.png"
            alt="About Flare"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="relative z-10 container px-4">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-heading font-black text-white mb-3">Our Story</h1>
          <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto">
            Bringing the authentic taste of fire-grilled perfection to Bahawalpur.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-base sm:prose-lg dark:prose-invert max-w-none">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-primary">Born from Fire</h2>
            <p>
              Flare by TK started with a simple belief: Pakistani fast-casual dining deserves a premium upgrade. We didn't want to serve just another standard burger. We wanted to serve an experience.
            </p>
            <p>
              Located near Dubai Chowk in Bahawalpur, we use only the freshest ingredients, authentic spices, and the transformative power of the open flame. Our meat is marinated for hours, our naans are baked fresh, and our signature sauces are crafted in-house daily.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-10 not-prose">
              <img src="/zinger-burger.png" alt="Burgers" className="rounded-2xl shadow-lg w-full aspect-[4/3] object-cover" />
              <img src="/biryani.png" alt="Biryani" className="rounded-2xl shadow-lg w-full aspect-[4/3] object-cover" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-primary">Visit Us in Bahawalpur</h2>
            <p>
              Whether you're craving a loaded burger, a comforting biryani, or the best broast in town, our doors are open. Order online or come visit us — we're right near Dubai Chowk.
            </p>

            <div className="bg-secondary p-6 sm:p-8 rounded-2xl not-prose mt-8 border">
              <h3 className="font-heading font-bold text-xl mb-4">Location & Hours</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-muted-foreground mb-1 text-sm">Address</p>
                  <p className="font-medium">Near Dubai Chowk, Mehmood CNG<br />Bahawalpur, Punjab, Pakistan</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1 text-sm">Contact</p>
                  <p className="font-medium">0345-1116520</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1 text-sm">Opening Hours</p>
                  <p className="font-medium">Every Day<br />12:00 PM – 1:00 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
