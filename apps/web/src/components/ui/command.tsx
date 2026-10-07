'use client';

import * as React from 'react';
import { type PropsWithChildren } from 'react';
import {
  Command as CommandPrimitive,
  CommandInput as CommandInputPrimitive,
  CommandList as CommandListPrimitive,
  CommandEmpty as CommandEmptyPrimitive,
  CommandGroup as CommandGroupPrimitive,
  CommandItem as CommandItemPrimitive,
  CommandSeparator as CommandSeparatorPrimitive,
} from 'cmdk';
import { Search } from 'lucide-react';

import { cn } from '@/lib/utils';

type CommandProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive>;

const Command = React.forwardRef<React.ElementRef<typeof CommandPrimitive>, CommandProps>(
  ({ className, ...props }, ref) => (
    <CommandPrimitive
      ref={ref}
      className={cn(
        'bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md',
        className
      )}
      {...props}
    />
  )
);
Command.displayName = CommandPrimitive.displayName;

type CommandInputProps = React.ComponentPropsWithoutRef<typeof CommandInputPrimitive>;

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandInputPrimitive>,
  CommandInputProps
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b px-3">
    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <CommandInputPrimitive
      ref={ref}
      className={cn(
        'placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  </div>
));
CommandInput.displayName = CommandInputPrimitive.displayName;

type CommandListProps = React.ComponentPropsWithoutRef<typeof CommandListPrimitive>;

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandListPrimitive>,
  CommandListProps
>(({ className, ...props }, ref) => (
  <CommandListPrimitive
    ref={ref}
    className={cn('max-h-[300px] overflow-x-hidden overflow-y-auto', className)}
    {...props}
  />
));
CommandList.displayName = CommandListPrimitive.displayName;

type CommandEmptyProps = React.ComponentPropsWithoutRef<typeof CommandEmptyPrimitive>;

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandEmptyPrimitive>,
  CommandEmptyProps
>(({ className, ...props }, ref) => (
  <CommandEmptyPrimitive
    ref={ref}
    className={cn('py-6 text-center text-sm', className)}
    {...props}
  />
));
CommandEmpty.displayName = CommandEmptyPrimitive.displayName;

type CommandGroupProps = React.ComponentPropsWithoutRef<typeof CommandGroupPrimitive>;

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandGroupPrimitive>,
  CommandGroupProps
>(({ className, ...props }, ref) => (
  <CommandGroupPrimitive
    ref={ref}
    className={cn(
      'text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium',
      className
    )}
    {...props}
  />
));
CommandGroup.displayName = CommandGroupPrimitive.displayName;

type CommandSeparatorProps = React.ComponentPropsWithoutRef<typeof CommandSeparatorPrimitive>;

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandSeparatorPrimitive>,
  CommandSeparatorProps
>(({ className, ...props }, ref) => (
  <CommandSeparatorPrimitive
    ref={ref}
    className={cn('bg-border -mx-1 h-px', className)}
    {...props}
  />
));
CommandSeparator.displayName = CommandSeparatorPrimitive.displayName;

type CommandItemProps = React.ComponentPropsWithoutRef<typeof CommandItemPrimitive>;

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandItemPrimitive>,
  CommandItemProps
>(({ className, ...props }, ref) => (
  <CommandItemPrimitive
    ref={ref}
    className={cn(
      'relative flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm transition-colors outline-none select-none',
      'focus:bg-accent focus:text-accent-foreground',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      'aria-selected:bg-accent aria-selected:text-accent-foreground',
      className
    )}
    {...props}
  />
));
CommandItem.displayName = CommandItemPrimitive.displayName;

type CommandShortcutProps = PropsWithChildren<{
  className?: string;
}>;

function CommandShortcut({ className, children }: CommandShortcutProps) {
  return (
    <span className={cn('ml-auto text-xs tracking-widest opacity-60', className)}>{children}</span>
  );
}

export {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
