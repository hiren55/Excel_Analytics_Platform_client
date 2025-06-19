import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const Pricing = () => {
    const plans = [
        {
            name: 'Basic',
            price: '$9',
            description: 'Perfect for individuals and small projects',
            features: [
                'Excel file upload and analysis',
                'Basic chart generation',
                '7-day analysis history',
                'Email support'
            ]
        },
        {
            name: 'Pro',
            price: '$29',
            description: 'Ideal for growing businesses',
            features: [
                'Everything in Basic',
                'Advanced chart types',
                '30-day analysis history',
                'AI-powered insights',
                'Priority support',
                'Team collaboration'
            ],
            popular: true
        },
        {
            name: 'Enterprise',
            price: '$99',
            description: 'For large organizations',
            features: [
                'Everything in Pro',
                'Unlimited analysis history',
                'Custom chart templates',
                'Advanced AI analytics',
                'Dedicated support',
                'API access',
                'Custom integrations'
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-extrabold text-white sm:text-4xl"
                    >
                        Simple, transparent pricing
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mt-4 text-xl text-gray-300"
                    >
                        Choose the plan that's right for you
                    </motion.p>
                </div>

                <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:grid-cols-3">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`rounded-lg shadow-lg divide-y divide-gray-700 ${plan.popular ? 'border-2 border-purple-500' : 'border border-gray-700'
                                }`}
                        >
                            <div className="p-6">
                                <h3 className="text-2xl font-semibold text-white">{plan.name}</h3>
                                <p className="mt-4 text-gray-300">{plan.description}</p>
                                <p className="mt-8">
                                    <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                                    <span className="text-base font-medium text-gray-300">/month</span>
                                </p>
                                <button
                                    className={`mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium ${plan.popular
                                            ? 'bg-purple-600 text-white hover:bg-purple-700'
                                            : 'bg-gray-700 text-white hover:bg-gray-600'
                                        }`}
                                >
                                    Get started
                                </button>
                            </div>
                            <div className="pt-6 pb-8 px-6">
                                <h4 className="text-sm font-medium text-white tracking-wide uppercase">What's included</h4>
                                <ul className="mt-6 space-y-4">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex space-x-3">
                                            <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                                            <span className="text-sm text-gray-300">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Pricing; 