"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Mail,
  MailOpen,
  Clock,
  Phone,
  Search,
  Trash2,
  CheckCheck,
  ArrowLeft,
  Reply,
  MoreVertical,
  Inbox,
  Star,
  StarOff,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Message = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  isRead: boolean;
  isStarred: boolean;
  image: string;
};

const initialMessages: Message[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 555-0201",
    subject: "Inquiry about cardiac services",
    message:
      "Hello, I would like to inquire about the cardiac consultation services available at your hospital. I have been experiencing some chest discomfort lately and would like to schedule an appointment with a cardiologist. Could you please provide me with information about the available doctors and their schedules? Thank you.",
    date: "2024-01-15T10:30:00",
    isRead: false,
    isStarred: true,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "2",
    name: "Emily Johnson",
    email: "emily.j@email.com",
    phone: "+1 555-0202",
    subject: "Appointment rescheduling request",
    message:
      "Hi, I had an appointment scheduled for tomorrow with Dr. Sarah Wilson, but unfortunately I need to reschedule due to a work emergency. Could you please help me find an alternative time slot? I apologize for any inconvenience this may cause.",
    date: "2024-01-15T09:15:00",
    isRead: false,
    isStarred: false,
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "3",
    name: "Robert Davis",
    email: "robert.davis@email.com",
    phone: "+1 555-0203",
    subject: "Feedback on recent visit",
    message:
      "I wanted to take a moment to thank your staff for the excellent care I received during my recent visit. Dr. Michael Chen was very thorough and professional. The nurses were also very attentive and kind. I would definitely recommend your hospital to friends and family.",
    date: "2024-01-14T16:45:00",
    isRead: true,
    isStarred: true,
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "4",
    name: "Maria Garcia",
    email: "maria.g@email.com",
    phone: "+1 555-0204",
    subject: "Insurance coverage question",
    message:
      "Hello, I am considering switching to your hospital for my healthcare needs. Before I do, I would like to know if you accept Blue Cross Blue Shield insurance? Also, what documents would I need to bring for my first visit? Thank you for your help.",
    date: "2024-01-14T14:20:00",
    isRead: true,
    isStarred: false,
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "5",
    name: "David Miller",
    email: "david.miller@email.com",
    phone: "+1 555-0205",
    subject: "Pediatric services inquiry",
    message:
      "We recently moved to the area and are looking for a pediatrician for our two children. Could you provide information about your pediatric department, including the doctors available and vaccination schedules? We would also like to know about your operating hours.",
    date: "2024-01-14T11:00:00",
    isRead: true,
    isStarred: false,
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "6",
    name: "Sarah Thompson",
    email: "sarah.t@email.com",
    phone: "+1 555-0206",
    subject: "Lab results inquiry",
    message:
      "Good morning, I visited your hospital last week for some blood tests and was told the results would be ready in 3-5 business days. It has been a week now and I haven't received any communication. Could you please check on the status of my lab results? My patient ID is PT-2024-0892.",
    date: "2024-01-13T08:30:00",
    isRead: true,
    isStarred: false,
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
  },
];

type FilterType = "all" | "unread" | "starred";

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  const unreadCount = messages.filter((m) => !m.isRead).length;

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.email.toLowerCase().includes(searchQuery.toLowerCase());

    if (filter === "unread") return matchesSearch && !message.isRead;
    if (filter === "starred") return matchesSearch && message.isStarred;
    return matchesSearch;
  });

  const handleSelectMessage = (message: Message) => {
    if (!message.isRead) {
      setMessages((prev) =>
        prev.map((m) => (m.id === message.id ? { ...m, isRead: true } : m)),
      );
    }
    setSelectedMessage({ ...message, isRead: true });
  };

  const handleMarkAsUnread = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isRead: false } : m)),
    );
    setSelectedMessage(null);
  };

  const handleToggleStar = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isStarred: !m.isStarred } : m)),
    );
    if (selectedMessage?.id === id) {
      setSelectedMessage((prev) =>
        prev ? { ...prev, isStarred: !prev.isStarred } : null,
      );
    }
  };

  const handleDelete = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (selectedMessage?.id === id) {
      setSelectedMessage(null);
    }
  };

  const handleMarkAllAsRead = () => {
    setMessages((prev) => prev.map((m) => ({ ...m, isRead: true })));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="h-[calc(100vh-8rem)]">
      <Card className="h-full overflow-hidden">
        <div className="flex h-full">
          {/* Sidebar - Message List */}
          <div
            className={`w-full md:w-96 border-r border-border flex flex-col shrink-0 ${
              selectedMessage ? "hidden md:flex" : "flex"
            }`}
          >
            {/* Search & Filter Header */}
            <div className="p-4 border-b border-border space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={filter === "all" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilter("all")}
                  className="gap-1.5"
                >
                  <Inbox className="h-4 w-4" />
                  All
                  <Badge variant="secondary" className="ml-1">
                    {messages.length}
                  </Badge>
                </Button>
                <Button
                  variant={filter === "unread" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilter("unread")}
                  className="gap-1.5"
                >
                  <Mail className="h-4 w-4" />
                  Unread
                  {unreadCount > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
                <Button
                  variant={filter === "starred" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilter("starred")}
                  className="gap-1.5"
                >
                  <Star className="h-4 w-4" />
                  Starred
                </Button>
              </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto">
              {filteredMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
                  <Inbox className="h-12 w-12 mb-3 opacity-50" />
                  <p className="font-medium">No messages found</p>
                  <p className="text-sm">Try adjusting your search or filter</p>
                </div>
              ) : (
                filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    onClick={() => handleSelectMessage(message)}
                    className={`p-4 border-b border-border cursor-pointer transition-colors hover:bg-muted/50 ${
                      !message.isRead ? "bg-primary/5" : ""
                    } ${selectedMessage?.id === message.id ? "bg-muted" : ""}`}
                  >
                    <div className="flex gap-3">
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarImage src={message.image} />
                        <AvatarFallback>
                          {message.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span
                            className={`truncate ${
                              !message.isRead
                                ? "font-semibold text-foreground"
                                : "font-medium text-muted-foreground"
                            }`}
                          >
                            {message.name}
                          </span>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={(e) => handleToggleStar(message.id, e)}
                              className="p-1 hover:bg-muted rounded"
                            >
                              {message.isStarred ? (
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              ) : (
                                <StarOff className="h-4 w-4 text-muted-foreground" />
                              )}
                            </button>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(message.date)}
                            </span>
                          </div>
                        </div>
                        <p
                          className={`text-sm truncate mb-1 ${
                            !message.isRead
                              ? "font-medium text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {message.subject}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {message.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer with Mark All Read */}
            {unreadCount > 0 && (
              <div className="p-3 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full gap-2"
                  onClick={handleMarkAllAsRead}
                >
                  <CheckCheck className="h-4 w-4" />
                  Mark all as read
                </Button>
              </div>
            )}
          </div>

          {/* Message Detail View */}
          <div
            className={`flex-1 flex flex-col min-w-0 ${
              selectedMessage ? "flex" : "hidden md:flex"
            }`}
          >
            {selectedMessage ? (
              <>
                {/* Message Header */}
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between mb-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="md:hidden gap-2"
                      onClick={() => setSelectedMessage(null)}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </Button>
                    <div className="flex items-center gap-2 ml-auto">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleStar(selectedMessage.id)}
                      >
                        {selectedMessage.isStarred ? (
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        ) : (
                          <StarOff className="h-5 w-5" />
                        )}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              handleMarkAsUnread(selectedMessage.id)
                            }
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Mark as unread
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(selectedMessage.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <h2 className="text-xl font-semibold mb-4">
                    {selectedMessage.subject}
                  </h2>

                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12 shrink-0">
                      <AvatarImage src={selectedMessage.image} />
                      <AvatarFallback>
                        {selectedMessage.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold">
                          {selectedMessage.name}
                        </span>
                        <span className="text-sm text-muted-foreground truncate">
                          &lt;{selectedMessage.email}&gt;
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 shrink-0" />
                          {formatFullDate(selectedMessage.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5 shrink-0" />
                          {selectedMessage.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message Body */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="max-w-2xl">
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap break-words">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                {/* Message Actions */}
                <div className="p-4 border-t border-border">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Button asChild className="gap-2">
                      <a href={`mailto:${selectedMessage.email}`}>
                        <Reply className="h-4 w-4" />
                        Reply
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => handleMarkAsUnread(selectedMessage.id)}
                    >
                      <MailOpen className="h-4 w-4" />
                      Mark as Unread
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(selectedMessage.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Mail className="h-10 w-10" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-1">
                  Select a message
                </h3>
                <p className="text-sm">
                  Choose a message from the list to view its contents
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
