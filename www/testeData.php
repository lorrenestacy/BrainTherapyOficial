<!DOCTYPE html>
<html>
<body>
<?php echo date('d/m/Y', strtotime($data)); ?>

<?php
$time = '1335236400';
$dataConvertida = date('d/m/Y', $time);
echo $dataConvertida; // formato a exibir 24/03/2012
?>
</body>
</html>