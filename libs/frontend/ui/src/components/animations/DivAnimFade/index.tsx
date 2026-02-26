import { motion, AnimatePresence, type HTMLMotionProps } from 'motion/react';
import { transitions, variants } from '../../../constants/animations';

interface Props extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  show?: boolean;
}

export const DivAnimFade = ({
  children,
  show,
  transition = transitions.default,
  ...rest
}: Props) => {
  const content = (
    <motion.div {...variants.fade} transition={transition} {...rest}>
      {children}
    </motion.div>
  );

  if (show === undefined) return content;

  return <AnimatePresence>{show && content}</AnimatePresence>;
};
