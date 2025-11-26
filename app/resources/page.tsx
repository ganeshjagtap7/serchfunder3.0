"use client";

import Navbar from "@/app/components/Navbar";
import { Card, CardContent, CardHeader } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Icons } from "@/app/components/ui/Icons";
import Link from "next/link";

export default function ResourcesPage() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Left Sidebar (Navigation) */}
                    <aside className="hidden md:block md:col-span-3 space-y-4">
                        <Card>
                            <CardContent className="p-2 space-y-1">
                                <Link href="/dashboard" className="block">
                                    <Button variant="ghost" className="w-full justify-start font-medium gap-3">
                                        <Icons.Home className="h-4 w-4" />
                                        Home
                                    </Button>
                                </Link>
                                <Link href="/groups" className="block">
                                    <Button variant="ghost" className="w-full justify-start font-medium gap-3">
                                        <Icons.Users className="h-4 w-4" />
                                        Groups
                                    </Button>
                                </Link>
                                <Link href="/messages" className="block">
                                    <Button variant="ghost" className="w-full justify-start font-medium gap-3">
                                        <Icons.MessageSquare className="h-4 w-4" />
                                        Messages
                                    </Button>
                                </Link>
                                <Link href="/resources" className="block">
                                    <Button variant="primary" className="w-full justify-start font-medium gap-3">
                                        <Icons.BookOpen className="h-4 w-4" />
                                        Resources
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </aside>

                    {/* Main Content */}
                    <main className="col-span-12 md:col-span-9 space-y-6">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">Resources</h1>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="hover:border-primary transition-colors cursor-pointer">
                                <CardHeader>
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <Icons.BookOpen className="h-5 w-5 text-primary" />
                                        Search Fund Primer
                                    </h3>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        The essential guide to understanding the search fund model, from raising capital to acquiring a business.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="hover:border-primary transition-colors cursor-pointer">
                                <CardHeader>
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <Icons.Briefcase className="h-5 w-5 text-primary" />
                                        Legal Templates
                                    </h3>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Standardized LOI, NDA, and APA templates vetted by top ETA law firms.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="hover:border-primary transition-colors cursor-pointer">
                                <CardHeader>
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <Icons.Users className="h-5 w-5 text-primary" />
                                        Investor Directory
                                    </h3>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        A curated list of active search fund investors, including traditional and self-funded backers.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
