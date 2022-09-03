import {
	createStyles,
	UnstyledButton,
	Group,
	ThemeIcon,
	Collapse,
	Box,
	Text,
	useMantineColorScheme,
} from '@mantine/core';
import { useState, useEffect, type PropsWithChildren } from 'react';
import { VscChevronDown } from 'react-icons/vsc';

const useStyles = createStyles((theme, { opened }: { opened: boolean }) => ({
	control: {
		display: 'block',
		width: '100%',
		padding: theme.spacing.xs,
		color: theme.colorScheme === 'dark' ? theme.colors.dark![0] : theme.black,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark![7] : 'transparent',
		borderRadius: theme.radius.xs,

		'&:hover': {
			backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark![5] : theme.colors.gray![2],
			color: theme.colorScheme === 'dark' ? theme.white : theme.black,
		},
	},

	icon: {
		transition: 'transform 150ms ease',
		transform: opened ? 'rotate(180deg)' : 'rotate(0deg)',
	},
}));

export function Section({
	title,
	icon,
	padded = false,
	dense = false,
	defaultClosed = false,
	children,
}: PropsWithChildren<{
	defaultClosed?: boolean;
	dense?: boolean;
	icon?: JSX.Element;
	padded?: boolean;
	title: string;
}>) {
	const [opened, setOpened] = useState(!defaultClosed);
	const { colorScheme } = useMantineColorScheme();
	const { classes } = useStyles({ opened });

	useEffect(() => {
		setOpened(!defaultClosed);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Box sx={{ wordBreak: 'break-all' }}>
			<UnstyledButton className={classes.control} onClick={() => setOpened((isOpen) => !isOpen)}>
				<Group position="apart">
					<Group>
						{icon ? (
							<ThemeIcon variant={colorScheme === 'dark' ? 'filled' : 'outline'} radius="sm" size={30}>
								{icon}
							</ThemeIcon>
						) : null}
						<Text weight={600} size="md">
							{title}
						</Text>
					</Group>
					<VscChevronDown size={20} className={classes.icon} />
				</Group>
			</UnstyledButton>
			<Collapse in={opened}>
				{padded ? (
					<Box py={20} px={dense ? 0 : 31} mx={dense ? 10 : 25}>
						{children}
					</Box>
				) : (
					children
				)}
			</Collapse>
		</Box>
	);
}
