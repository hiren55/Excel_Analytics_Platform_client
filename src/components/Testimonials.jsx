import React from 'react';

const Testimonials = () => {
    const testimonials = [
        {
            quote: "DataViz has transformed how we analyze our business data. The insights we've gained are invaluable.",
            author: "Sarah Johnson",
            role: "Data Analyst",
            company: "TechCorp",
            image: "https://i.pravatar.cc/150?img=1"
        },
        {
            quote: "The real-time analytics feature has helped us make faster, more informed decisions.",
            author: "Michael Chen",
            role: "Product Manager",
            company: "InnovateX",
            image: "https://i.pravatar.cc/150?img=2"
        },
        {
            quote: "The AI-powered insights have uncovered patterns we never would have found on our own.",
            author: "Emily Rodriguez",
            role: "Business Intelligence Lead",
            company: "DataFlow",
            image: "https://i.pravatar.cc/150?img=3"
        }
    ];

    return (
        <section className="py-20 bg-gradient-to-b from-black to-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-in">
                        Trusted by Industry Leaders
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto animate-fade-in-up">
                        See what our customers have to say about their experience with DataViz
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="group p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105 animate-fade-in-up"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="flex items-center mb-4">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.author}
                                    className="w-12 h-12 rounded-full border-2 border-purple-500/50"
                                />
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-white">{testimonial.author}</h3>
                                    <p className="text-sm text-gray-400">{testimonial.role} at {testimonial.company}</p>
                                </div>
                            </div>
                            <blockquote className="text-gray-300 italic">
                                "{testimonial.quote}"
                            </blockquote>
                            <div className="mt-4 flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className="w-5 h-5 text-yellow-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <div className="inline-flex items-center space-x-4">
                        <div className="flex -space-x-2">
                            {[...Array(4)].map((_, i) => (
                                <img
                                    key={i}
                                    src={`https://i.pravatar.cc/150?img=${i + 4}`}
                                    alt={`User ${i + 1}`}
                                    className="w-10 h-10 rounded-full border-2 border-gray-900"
                                />
                            ))}
                        </div>
                        <p className="text-gray-400">
                            Join <span className="text-white font-semibold">10,000+</span> satisfied customers
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials; 