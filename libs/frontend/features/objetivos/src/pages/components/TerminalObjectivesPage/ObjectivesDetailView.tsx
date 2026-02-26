import { Heading } from '@biosstel/ui';
import { Stack, Grid } from '@biosstel/ui-layout';
import type { TerminalAssignmentCard } from '@biosstel/shared-types';
import { ObjectivesHeader } from './ObjectivesHeader';
import { AssignmentCard } from './AssignmentCard';

type ObjectivesDetailViewProps = {
  card: TerminalAssignmentCard;
  type: 'department' | 'person';
};

export const ObjectivesDetailView = ({ card, type }: ObjectivesDetailViewProps) => {
  // Construct a partial header for the selected entity to reuse the ObjectivesHeader stats visualization
  const detailHeader = {
    id: card.title, // using title as ID for display
    title: card.title,
    achieved: card.totalValue,
    objective: card.totalObjective,
    pct: card.totalObjective ? (card.totalValue / card.totalObjective) * 100 : 0,
  };

  return (
    <Stack gap={6}>
       {/* 
         Here we reuse the main header visualization but for the specific department/person stats.
         This gives the "expanded screen" feel the user requested.
       */}
       <ObjectivesHeader header={detailHeader} />

       <Stack gap={4}>
         <Heading level={2} className="text-gray-900 font-bold">
           {type === 'department' ? 'Centros de trabajo' : 'Detalle personal'}
         </Heading>
         
         {/* 
           Since the current data structure only has 'rows' which are simple label/value pairs,
           we will render them as a collection of "mini-cards" or a rich list to effectively fill the screen.
           For now, we'll re-render the card itself to show the breakdown, but conceptually this area
           is where the detailed breakdown of "Centro de trabajo 1", "Centro de trabajo 2" etc would go 
           if they were full objects.
           
           To make it look "expanded", we can just render the card again, OR if we want to be fancy,
           we could map the rows into their own cards if we had more data.
           Given the constraints, let's render the main card clearly.
         */}
         <Grid cols={1} gap={4}>
            <AssignmentCard card={card} type={type} className="max-w-md" />
         </Grid>
       </Stack>
    </Stack>
  );
};
