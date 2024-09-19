@props(['url'])
<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block;">
@if (trim($slot) === 'Laravel')
<img src="https://caei.com.ec/wp-content/uploads/2023/04/LOGO_CAEROJO.jpg" class="logo"  alt="Arquitectos Logo">
@else
<img src="https://caei.com.ec/wp-content/uploads/2023/04/LOGO_CAEROJO.jpg" class="logo" alt="Arquitectos Logo">
@endif
</a>
</td>
</tr>
